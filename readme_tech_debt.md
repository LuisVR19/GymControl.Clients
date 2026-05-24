# Technical Debt & Improvements — GymControl.Clients

## Executive Summary

The project is ~60% complete with a solid foundation: clean design system, well-structured lazy-loaded routing, and a consistent Supabase integration pattern. The main concerns are: pervasive `as any` casts that defeat TypeScript, fragile `history.state` navigation that breaks deep links, several dead-code methods, two hardcoded values still in the UI, duplicated styles across auth pages, and service responsibilities that don't match their domain. No critical security holes beyond the anon key in source control.

**Overall health: B− / needs cleanup before scaling**

---

## Critical Issues

### [✔] 1. Supabase anon key committed to source control

**Resolved.**

**What was done:**
- `src/environments/environment.ts` and `environment.prod.ts` added to `.gitignore` — they will never be tracked by Git going forward.
- `src/environments/environment.example.ts` and `environment.prod.example.ts` created as committed templates with placeholder values.
- The actual files with real credentials remain on disk and continue to work locally.

**Developer onboarding (fresh clone):**
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
# Fill in supabaseUrl and supabaseKey in both files
```

**⚠️ Action required:** If this repository has any commit history with the real key, rotate the Supabase anon key from the Supabase dashboard (Project Settings → API → Regenerate anon key). The old key must be considered compromised once it appears in any git history.

---

### [✔] 2. `history.state` used for all inter-page navigation

**Files:** `routine-detail.page.ts:45–53`, `workout.page.ts:59–61`

**Problem:** All navigation data (routineId, dayNumber, routineName, etc.) is passed through `history.state`.

**Why it's bad:**
- Breaks on hard refresh — `history.state` is lost when the user refreshes the page.
- Deep links are impossible — you can't share a URL to a specific routine.
- The app can't be reopened at the correct screen from a push notification.

**Fix:** Use route parameters for IDs, query params for display hints.

```ts
// Before
this.router.navigate(['/tabs/rutinas/detail'], {
  state: { routineId: r.routineId, routineName: r.name, ... }
});

// After — routing
{ path: 'detail/:routineId', component: RoutineDetailPage }

// After — navigation
this.router.navigate(['/tabs/rutinas/detail', r.routineId], {
  queryParams: { day: r.dayNumber }
});

// After — receiving
constructor(private route: ActivatedRoute) {}
ngOnInit() {
  this.routineId  = this.route.snapshot.paramMap.get('routineId')!;
  this.dayNumber  = Number(this.route.snapshot.queryParamMap.get('day') ?? 1);
}
```

---

### [✔] 3. Hardcoded UI values in `progress.page.html`

**File:** `src/app/features/progress/progress.page.html:52–55`

**Problem:** The bench press card has two hardcoded values that are never updated from the DB.

```html
<!-- Lines 52–55 — both values are static -->
<span class="num-display" style="font-size: 38px;">78</span>
<span class="pill pill-muted">+10 kg / 8 sem</span>
```

**Fix:** Compute the 1RM estimate from `benchData` (already fetched) and derive the delta from first vs last value.

```ts
// progress.page.ts
get bench1RM(): number {
  const last = this.benchData[this.benchData.length - 1] ?? 0;
  return Math.round(last * (1 + 0.033 * 8)); // Epley formula, 8 reps default
}
get benchDelta(): string {
  if (this.benchData.length < 2) return '';
  const diff = this.benchData[this.benchData.length - 1] - this.benchData[0];
  return (diff >= 0 ? '+' : '') + diff.toFixed(0) + ' kg';
}
```

---

### [✔] 4. Hardcoded muscle group in `workout.page.html`

**File:** `src/app/features/routines/workout/workout.page.html:9`

```html
<!-- Always shows "Pecho · Tríceps" regardless of actual workout -->
<p class="label-mono">Pecho · Tríceps</p>
```

**Fix:** Derive from loaded exercises.

```ts
// workout.page.ts
get muscleLabel(): string {
  const muscles = [...new Set(this.exercises.map(e => e.muscle).filter(Boolean))];
  return muscles.slice(0, 2).join(' · ') || 'Entreno';
}
```

---

### [❌] 5. Tab bar visibility controlled by URL string matching

**File:** `src/tabs/tabs.page.ts:21`

```ts
this.showTabBar = !url.includes('/workout') && !url.includes('/detail');
```

**Why it's bad:** Brittle. Any future route with "workout" or "detail" in its path (e.g. `/workout-history`, `/user-detail`) will unexpectedly hide the tab bar.

**Fix:** Use Angular route `data`.

```ts
// In routing module
{ path: 'workout', component: WorkoutPage, data: { hideTabBar: true } }
{ path: 'detail/:routineId', component: RoutineDetailPage, data: { hideTabBar: true } }

// tabs.page.ts
this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
  let route = this.router.routerState.root;
  while (route.firstChild) route = route.firstChild;
  this.showTabBar = !route.snapshot.data['hideTabBar'];
});
```

**⚠️ Intento fallido — REVERTIDO:**

Se aplicó el fix propuesto arriba (route `data` + traversal `while firstChild`) pero rompió el renderizado de las pantallas: solo cargaban el tab bar y el fondo, sin contenido. La causa probable es que Ionic gestiona su árbol de rutas internamente a través de `ion-tabs` / `IonRouterOutlet`, y el traversal síncrono de `routerState.root.firstChild` en `ngOnInit` interfiere con ese ciclo de vida antes de que Ionic haya montado los outlets. El `data` en las rutas child de un módulo lazy-loaded tampoco se propaga correctamente al snapshot en ese momento. **Requiere investigación adicional** con el lifecycle de `IonRouterOutlet` o uso de `ActivatedRouteSnapshot` del evento de navegación en lugar del estado del router.

---

## Medium Priority Issues

### [✔] 6. `getWeeklyStats()` is misplaced in `MembershipService`

**File:** `src/app/core/services/membership.service.ts:26–57`

**Problem:** Weekly workout stats (completed workouts, streak) have nothing to do with membership billing. The method also queries `workout_logs` and `user_schedule` — tables completely unrelated to membership.

**Fix:** Move to `WorkoutService` or create a `StatsService`.

```ts
// New: src/app/core/services/stats.service.ts
@Injectable({ providedIn: 'root' })
export class StatsService {
  async getWeeklyStats(): Promise<WeeklyStats> { ... }
}
```

Update `home.page.ts` injection accordingly.

---

### [❌] 7. Pervasive `as any` casts in service layer

**Files:** `routine.service.ts` (11 occurrences), `schedule.service.ts` (4), `membership.service.ts` (2)

**Problem:** TypeScript's type safety is completely bypassed. Runtime shape errors become invisible to the compiler.

**Fix:** Type the Supabase responses with local interfaces.

```ts
// Before — routine.service.ts:83
for (const ur of data as any[]) {
  const r = ur.routines;

// After — define a local type
interface UserRoutineRow {
  routine_id: string;
  assigned_at: string;
  routines: {
    id: string; name: string; description: string | null;
    routine_exercises: { day_number: number | null; day_label: string | null; sets: number; reps: number; order_number: number }[];
  } | null;
}
const rows = data as UserRoutineRow[];
for (const ur of rows) {
  const r = ur.routines;
```

**⚠️ Intento fallido — REVERTIDO:**

Se definieron interfaces locales para los tres servicios y se reemplazaron todos los `as any`. El cambio compiló parcialmente pero falló con:

```
ERROR src/app/core/services/membership.service.ts:49:39
TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.
```

**Causa raíz:** Al tipar `UserMembershipRow.next_payment_date` como `string | null` (correcto según el schema), el compilador detectó que `formatDate(iso: string)` no acepta `null`. Con `as any` este error estaba silenciado. La solución requiere ajustar la firma de `formatDate` a `formatDate(iso: string | null): string` antes de aplicar el tipado. **Requiere re-intentar con ese fix incluido.**

---

### [✔] 8. `MeasurementEntry` and `ScheduleEntry` interfaces defined outside `models/`

**Files:** `src/app/core/services/progress.service.ts:5–17`, `src/app/core/services/schedule.service.ts:5–11`

**Problem:** These are data-shape contracts that belong in `models/index.ts`. Defining them in service files means consumers must import from services instead of models, creating unexpected coupling.

**Fix:** Move both interfaces to `src/app/core/models/index.ts` and update imports.

---

### [✔] 9. Magic number `86400000` in `membership.service.ts`

**File:** `src/app/core/services/membership.service.ts:16`

```ts
// Before
Math.round((expiry.getTime() - start.getTime()) / 86400000)

// After
const MS_PER_DAY = 86_400_000;
Math.round((expiry.getTime() - start.getTime()) / MS_PER_DAY)
```

---

### [✔] 10. `MONTHS` and `DAY_NAMES` arrays duplicated across files

**Problem:** `MONTHS` appears in both `routine.service.ts:5` and `home.page.ts:11`. `DAY_NAMES` is in `routine.service.ts:6`. `DOW_NAMES` with same data is in `home.page.ts:11`.

**Fix:** Extract to `src/app/core/utils/date.utils.ts`.

```ts
export const MONTHS   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
export const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
export const DOW_FULL  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

export function todayDow(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}
export function formatDate(iso: string, locale = 'es-CR'): string { ... }
```

---

### [✔] 11. `AssignRoutineModalComponent` is inside `calendar` feature folder

**File:** `src/app/features/calendar/assign-routine-modal/`

**Problem:** This modal is conceptually a shared UI component that could be triggered from other screens (e.g., routine detail, home). Being inside `calendar/` makes it inaccessible to other features without cross-feature imports.

**Fix:** Move to `src/app/shared/components/assign-routine-modal/` and declare in `SharedModule`.

---

### [✔] 12. Auth page SCSS is fully duplicated

**Files:** `src/app/features/auth/login/login.page.scss` and `register/register.page.scss`

**Problem:** Both files contain the same `.auth-wrap`, `.auth-brand`, `.auth-field`, `.input-field` styles. Any future change must be made twice.

**Fix:** Create `src/app/features/auth/auth-shared.scss` and import it in both pages.

```scss
// auth-shared.scss
.auth-wrap { ... }
.auth-brand { ... }
.auth-field { ... }

// login.page.scss
@use '../auth-shared';
// only login-specific overrides here
```

---

### [✔] 13. `home.page.ts` computes `weekDots` imperatively instead of as a getter

**File:** `src/app/features/home/home.page.ts:62`

```ts
// Before — computed once in load(), becomes stale if stats update
this.weekDots = Array.from({ length: stats.total }, (_, i) => i < stats.completed ? 1 : 0);

// After — always in sync with stats
get weekDots(): number[] {
  return Array.from({ length: this.stats.total }, (_, i) => i < this.stats.completed ? 1 : 0);
}
```

---

### [✔] 14. No loading state on routines list, profile, or calendar pages

**Problem:** `home.page.ts` has a `loading` flag with skeleton UI for the stats cards. `routines.page.ts` has a `loading` flag but no skeleton in the template — the list just appears empty. `profile.page.ts` has `loading = true` but no skeleton markup. The user sees a blank card briefly on every load.

**Fix:** Add skeleton rows to `routines.page.html` and `profile.page.html`, following the same pattern already used in `routine-detail.page.html`.

---

### [✔] 15. `ScheduleService.getTodayWorkout()` makes 2 sequential DB calls

**File:** `src/app/core/services/schedule.service.ts:57–89`

**Problem:** First queries `user_schedule`, then queries `routine_exercises` in a separate round trip. On slow connections this doubles latency for the home screen hero card.

**Fix:** The second query (`routine_exercises`) can be included via a nested select in the first query.

```ts
const { data: schedule } = await supabase
  .from('user_schedule')
  .select(`
    routine_id, day_number, routines(name),
    routines!inner(routine_exercises(day_number, sets))
  `)
  .eq('user_id', user.id)
  .eq('day_of_week', todayDow)
  .single();
```

---

## Low Priority Improvements

### 16. Dead code: `WorkoutService.checkIn()` is never called

**File:** `src/app/core/services/workout.service.ts:53–57`

The method inserts to `attendance` but no component calls it. Either wire it to the workout start flow or remove it until needed.

---

### 17. Dead code: `RoutineService.getUpcomingWorkouts()` is never called

**File:** `src/app/core/services/routine.service.ts:116–150`

This method builds upcoming workout cards but no page currently uses it. Remove or connect to the calendar page.

---

### 18. `AttendanceService` is never injected anywhere

**File:** `src/app/core/services/attendance.service.ts`

`getAttendanceDays()` is defined but no page or component imports this service. The calendar page builds its own attendance display without using it. Remove or integrate.

---

### 19. `AuthGuard` is not resilient to network errors

**File:** `src/app/core/guards/auth.guard.ts`

```ts
// If supabase.auth.getSession() throws (network error), the guard
// propagates the exception and the router shows a blank screen.

// Fix: wrap in try/catch
async canActivate(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return true;
  } catch {
    // network error — fail open or show offline page
  }
  this.router.navigate(['/auth/login']);
  return false;
}
```

---

### 20. `WorkoutService.getBenchData()` uses ascending order + oldest-first limit

**File:** `src/app/core/services/workout.service.ts:23`

Same bug that existed in `getWeightData()` (fixed): the bench query fetches the 7 oldest sets rather than the 7 most recent. The sparkline shows ancient data.

```ts
// Fix: order DESC, limit, reverse
const { data } = await supabase
  .from('workout_logs').select('weight, created_at')
  .eq('exercise_id', exData[0].id)
  .order('created_at', { ascending: false }).limit(7);
return (data ?? []).map(l => Number(l.weight)).reverse();
```

---

### 21. `WorkoutService.getVolumeData()` fetches up to 200 rows client-side

**File:** `src/app/core/services/workout.service.ts:29`

The method downloads 200 rows to compute a 8-point chart. A Supabase RPC or a `GROUP BY date` query would reduce data transfer by ~25x.

---

### 22. `MembershipService.getActiveMembership()` doesn't filter by `user_id`

**File:** `src/app/core/services/membership.service.ts:8`

Relies entirely on RLS (`.eq('is_current', true)` only). While RLS should handle this, adding `.eq('user_id', userId)` makes the intent explicit and adds a safety net.

---

### 23. `progress.page.ts` injects `WorkoutService` but only uses 2 methods

Data for three different concerns (weight, bench, volume) is loaded from two different services in one `load()` call. Consider a `StatsService` that aggregates all chart data.

---

### 24. Missing `trackBy` on `*ngFor` in heavy lists

**Files:** `routines.page.html`, `routine-detail.page.html`, `workout.page.html`

Without `trackBy`, Angular re-renders entire DOM nodes on any change. Add `trackBy` functions for exercise lists.

```html
<div *ngFor="let ex of g.exercises; trackBy: trackById">

// component
trackById(i: number, item: { id: string }) { return item.id; }
```

---

### 25. Inline `style=""` attributes scattered across templates

**Files:** `home.page.html`, `progress.page.html`, `profile.page.html`, `routine-detail.page.html`

Over 20 instances of `style="font-size:38px"`, `style="margin-bottom:8px"`, etc. These are untrackable in SCSS and ignore the theme system.

**Fix:** Extract to semantic class names in the component SCSS.

---

### 26. `ion-content [fullscreen]="true"` inconsistently used

`workout.page.html` and `home.page.html` use `[fullscreen]="true"`. `profile.page.html` and `progress.page.html` do not. Pick one behavior and apply it consistently.

---

## Security Considerations

| Issue | Risk | Fix |
|---|---|---|
| Anon key in source control | Low–Medium (key is public by design; risk if RLS misconfigured) | Use env vars / .gitignore |
| No rate limiting on login | Medium | Supabase handles this server-side; verify it's enabled in dashboard |
| `profiles` upsert in `register()` sends `role: 'CLIENT'` from client | Low | Server-side trigger or RLS CHECK is the correct enforcement point |
| No input sanitization on workout set weight/reps fields | Low | Add `min="0" max="9999"` constraints on `input-num` fields |
