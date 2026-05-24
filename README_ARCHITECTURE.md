# Architecture & System Documentation — GymControl.Clients

## Overview

**GymControl (codename: Forja)** is a mobile-first gym management app for clients of a multi-gym platform. It lets a gym member view their assigned workout routines, execute workouts with set/rep tracking, monitor body composition progress, manage their membership, and schedule weekly training days.

The client app is built for iOS/Android via Capacitor. There is a separate web-based owner module (designed in prototype only; not implemented in this repo).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (NgModule architecture, `standalone: false`) |
| Mobile shell | Ionic 8 (iOS mode forced globally) |
| Native runtime | Capacitor 8 (Android added; iOS not yet) |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Supabase client | `@supabase/supabase-js` v2 |
| Styling | SCSS + Ionic CSS custom properties + custom design tokens |
| Charting | Custom SVG components (no third-party chart lib) |
| State management | None (imperative async/await + BehaviorSubject for auth) |
| Routing | Angular Router with lazy loading + `PreloadAllModules` |
| Language | TypeScript 5.9 |

---

## Project Structure

```
src/
├── app/
│   ├── app.module.ts              Root module — bootstraps AppComponent
│   ├── app-routing.module.ts      Top-level routes: /auth (lazy) + /tabs (lazy, guarded)
│   │
│   ├── core/                      Singleton services, models, guards
│   │   ├── guards/
│   │   │   └── auth.guard.ts      Redirects to /auth/login if no active session
│   │   ├── models/
│   │   │   └── index.ts           All TypeScript interfaces for UI + DB models
│   │   ├── supabase.client.ts     Single Supabase client instance (module-level singleton)
│   │   └── services/
│   │       ├── auth.service.ts         Session + profile management, BehaviorSubject streams
│   │       ├── membership.service.ts   Active plan + weekly stats (misplaced — see tech debt)
│   │       ├── payment.service.ts      Payment history
│   │       ├── workout.service.ts      Log sets, bench/volume chart data, gym check-in
│   │       ├── attendance.service.ts   Calendar attendance days (currently unused)
│   │       ├── schedule.service.ts     Weekly routine schedule CRUD + today's workout
│   │       ├── routine.service.ts      Routine list, exercise loader, last performance
│   │       ├── progress.service.ts     Body weight chart, measurements save/load
│   │       └── theme.service.ts        Light/dark toggle persisted to localStorage
│   │
│   ├── features/                  One folder per screen group
│   │   ├── auth/                  Login + Register pages, AuthModule
│   │   ├── home/                  Home tab (today's workout hero + weekly stats card)
│   │   ├── routines/              Routines list + Detail screen + Workout execution
│   │   ├── progress/              Charts (weight, bench, volume) + measurements grid
│   │   ├── calendar/              Weekly agenda view + AssignRoutineModal
│   │   └── profile/               User header + membership card + payments + settings
│   │
│   ├── shared/                    Reusable components, declared in SharedModule
│   │   ├── shared.module.ts
│   │   └── components/
│   │       ├── avatar/            Initials avatar with oklch color derived from name
│   │       ├── sparkline/         SVG line chart with optional fill
│   │       ├── bar-chart/         SVG bar chart
│   │       └── log-measurements-modal/   12-field body measurements bottom sheet
│   │
│   └── tabs/                      Tab bar shell page + tabs routing module
│
├── environments/
│   ├── environment.ts             dev — Supabase URL + anon key
│   └── environment.prod.ts        prod — same values (should use env vars)
│
├── global.scss                    Ionic overrides + global utility classes
└── theme/variables.scss           Design tokens (colors, fonts, radii, dark mode)
```

---

## Core Flows

### Authentication Flow

```
App launch
  └─ AppRoutingModule
       ├─ Route '' → TabsPageModule (AuthGuard)
       │     AuthGuard → supabase.auth.getSession()
       │           ├─ session exists → allow (return true)
       │           └─ no session    → navigate('/auth/login'), return false
       │
       └─ Route '/auth' → AuthModule (no guard)
             └─ LoginPage
                   └─ AuthService.login(email, password)
                         └─ supabase.auth.signInWithPassword()
                               ├─ error → throw (page catches, shows toast)
                               └─ success → onAuthStateChange fires
                                     └─ AuthService.loadProfile(userId)
                                           └─ profileSubject.next(profile)
                                     └─ Router (from guard redirect) → /tabs/inicio
```

`AuthService` exposes two `BehaviorSubject` streams:
- `user$` — the raw Supabase `User` object
- `profile$` — the `profiles` table row with name, role, etc.

Pages that need the user's name subscribe to `profile$` in `ngOnInit`.

---

### Main App Navigation Flow

```
/tabs (TabsPage shell)
  ├─ /tabs/inicio   → HomePage
  ├─ /tabs/rutinas  → RoutinesPage
  │     ├─ /tabs/rutinas/detail/:id  → RoutineDetailPage  (tab bar hidden)
  │     └─ /tabs/rutinas/workout     → WorkoutPage        (tab bar hidden)
  ├─ /tabs/progreso → ProgressPage
  ├─ /tabs/agenda   → CalendarPage
  └─ /tabs/perfil   → ProfilePage
```

`TabsPage` listens to `NavigationEnd` events and sets `showTabBar = false` when the URL contains `/workout` or `/detail`. This hides the bottom tab bar for full-screen flows.

All feature modules are lazy-loaded. `PreloadAllModules` strategy preloads them after the initial render.

---

### Workout Execution Flow

```
RoutinesPage
  └─ tap routine card
       └─ openDetail(routine)
             └─ router.navigate(['/tabs/rutinas/detail'], { state: { routineId, ... } })
                   └─ RoutineDetailPage.ngOnInit()
                         └─ reads history.state for all display values
                         └─ RoutineService.getWorkoutExercises(routineId, dayNumber)
                               └─ Supabase: routine_exercises JOIN exercises
                               └─ fetchLastPerformances() — workout_logs for each exercise
                   └─ tap "Empezar entreno"
                         └─ router.navigate(['/tabs/rutinas/workout'], { state: { routineId, dayNumber } })
                               └─ WorkoutPage.ngOnInit()
                                     └─ loads exercises (same service call)
                                     └─ starts interval timer
                               └─ user marks sets done, enters weights
                               └─ tap "Finalizar entreno"
                                     └─ finishWorkout()
                                           ├─ collects done sets (weight 0 allowed)
                                           ├─ if no sets done → inserts marker row (weight=0)
                                           └─ WorkoutService.logWorkout(logs)
                                                 └─ INSERT into workout_logs
                                           └─ navigate back to /tabs/rutinas
```

---

### Weekly Stats Update Flow

```
WorkoutPage.finishWorkout()
  └─ workout_logs INSERT (always — at least one marker row)

HomePage.load()
  └─ MembershipService.getWeeklyStats()
        ├─ user_schedule COUNT → stats.total  (how many days scheduled)
        ├─ workout_logs WHERE created_at >= monday → distinct dates → stats.completed
        └─ workout_logs last 60 rows → consecutive days streak

HomePage template
  └─ stats card shows completed/total
  └─ weekDots: Array(total) filled for first `completed` items
```

---

### Data Flow — Frontend ↔ Supabase

All backend communication goes through a single Supabase client instance at `src/app/core/supabase.client.ts`. There is **no HTTP interceptor, no caching layer, no request queue**. Every page load triggers fresh network requests.

```
Component/Page
  └─ calls Service method (e.g. RoutineService.getWorkoutExercises)
       └─ supabase.from('table').select(...)
             └─ Supabase REST API (PostgREST) over HTTPS
             └─ Row Level Security enforces user_id isolation on the DB side
       └─ returns typed data (or `as any` cast — see tech debt)
  └─ assigns to component property
  └─ Angular change detection → template re-renders
```

**No data is cached between page visits.** Every time a page enters, `ngOnInit` fires and re-fetches all data. This means multiple round trips on every tab switch.

---

## Key Modules

### `AuthModule` (`/auth`)
Lazy-loaded. Two pages: `LoginPage` and `RegisterPage`. Uses `ReactiveFormsModule` for form validation. On successful auth, `AuthService` updates `BehaviorSubject` streams consumed app-wide.

### `TabsModule` (`/tabs`)
The persistent shell. Contains the `TabsPage` which renders `<ion-tabs>` with 5 tab buttons. Watches router events to conditionally hide the tab bar.

### `RoutinesPageModule` (`/tabs/rutinas`)
Three pages in one module:
- `RoutinesPage` — list of assigned routine days
- `RoutineDetailPage` — exercise list for one routine day, CTA to start workout
- `WorkoutPage` — active workout: timer, set/rep inputs, navigation between exercises, completion logging

### `HomePageModule` (`/tabs/inicio`)
Dashboard: today's workout hero card (from `ScheduleService`), weekly stats card (from `MembershipService`), membership card (from `MembershipService`), quick action buttons.

### `ProgressPageModule` (`/tabs/progreso`)
Charts: body weight sparkline, bench press bar chart, volume sparkline. Body measurement grid with delta. `LogMeasurementsModalComponent` (from `SharedModule`) triggered by "Nueva" button.

### `CalendarPageModule` (`/tabs/agenda`)
Monthly calendar view with attendance dots. Weekly schedule display. `AssignRoutineModalComponent` (currently inside this module — should be in shared) triggered by "+" button.

### `ProfilePageModule` (`/tabs/perfil`)
Avatar + name, active membership card with progress bar and features, payment history, settings list with logout.

### `SharedModule`
Re-exported everywhere via module imports. Contains:
- `SparklineComponent` — pure SVG, `OnChanges` only, no side effects
- `BarChartComponent` — pure SVG bar chart
- `AvatarComponent` — initials + deterministic oklch background color
- `LogMeasurementsModalComponent` — bottom sheet form with 12 measurement fields

---

## API Integration

### Supabase Client Setup

```ts
// src/app/core/supabase.client.ts
export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true }
});
```

Session is persisted to `localStorage` automatically. Token refresh happens silently in the background.

### Query Patterns Used

| Pattern | Example | Used in |
|---|---|---|
| Simple select | `.from('t').select('col').eq('id', x)` | All services |
| Nested join | `.select('routines(name)')` | schedule.service, routine.service |
| Upsert with conflict | `.upsert({...}, { onConflict: 'user_id,date' })` | schedule.service, progress.service |
| Count only | `.select('*', { count: 'exact', head: true })` | membership.service |
| In-clause | `.in('exercise_id', ids)` | routine.service |
| Date range | `.gte('created_at', monday.toISOString())` | membership.service |

### Row Level Security

All tables use Supabase RLS. Most service queries do **not** explicitly filter by `user_id` — they rely on RLS policies to isolate data. This means:
- If RLS is disabled on a table, a user could see other users' data.
- Always verify RLS is enabled when adding new tables.

---

## How to Run the Project

```bash
# Install dependencies
npm install

# Start dev server (browser)
npm start
# or
ionic serve

# Build for production
npm run build
# or
ionic build --prod

# Run on Android (requires Android Studio)
npx cap sync android
npx cap open android
```

**Environment:** Copy `src/environments/environment.ts` and set your Supabase URL and anon key. Do not commit real keys.

---

## How to Extend the Project

### Adding a New Tab Screen

1. Create `src/app/features/<name>/<name>.page.ts|html|scss`
2. Create `<name>.module.ts` and `<name>-routing.module.ts`
3. Add route to `src/app/tabs/tabs-routing.module.ts`
4. Add `ion-tab-button` to `src/app/tabs/tabs.page.html`
5. Import `SharedModule` in the new module for access to shared components

### Adding a New Service

1. Create `src/app/core/services/<name>.service.ts`
2. Mark `@Injectable({ providedIn: 'root' })`
3. Add any new interfaces to `src/app/core/models/index.ts`
4. Inject via constructor in pages that need it

### Adding a New Shared Component

1. Create folder under `src/app/shared/components/<name>/`
2. Create `.ts`, `.html`, `.scss` files with `standalone: false`
3. Add to `declarations` and `exports` in `src/app/shared/shared.module.ts`

### Using the Design System

All design tokens are in `src/theme/variables.scss`. Always use CSS custom properties instead of raw values:

```scss
// Good
color: var(--ink);
background: var(--bg-sunk);
border-radius: var(--radius-lg);
font-family: var(--font-display);

// Bad — breaks dark mode and theming
color: #0E0E0C;
background: #F0F0ED;
```

Global utility classes available everywhere (defined in `src/global.scss`):
- `.card` — standard card surface
- `.label-mono` — uppercase monospaced label
- `.num-display` — large display number
- `.pill` / `.pill-accent` / `.pill-muted` / `.pill-success` / `.pill-danger`
- `.btn-primary` / `.btn-accent` / `.btn-ghost` / `.btn-icon`
- `.input-num` — number input for workout sets

### Adding a New Supabase Table

1. Create the table in Supabase dashboard with RLS enabled
2. Add a row-level policy: `CREATE POLICY "user_isolation" ON table USING (auth.uid() = user_id)`
3. Add the interface to `src/app/core/models/index.ts`
4. Add the service method in the appropriate `src/app/core/services/*.service.ts`
5. Update `DATABASE.md` in the project root
