// ─── Form / input shapes ─────────────────────────────────────────────────────

export interface MeasurementEntry {
  weight?:     number;
  bodyFat?:    number;
  neck?:       number;
  chest?:      number;
  waist?:      number;
  hip?:        number;
  leftArm?:    number;
  rightArm?:   number;
  thighLeft?:  number;
  thighRight?: number;
  calfLeft?:   number;
  calfRight?:  number;
}

export interface ScheduleEntry {
  id:          string;
  dayOfWeek:   number;   // 1=Lun … 7=Dom
  routineId:   string;
  dayNumber:   number;
  routineName: string;
}

// ─── DB row types ────────────────────────────────────────────────────────────

export interface GymInfo {
  id:        string;
  name:      string;
  logo_url:  string | null;
  address:   string | null;
  phone:     string | null;
  whatsapp:  string | null;
  website:   string | null;
  instagram: string | null;
  about:     string | null;
}

export interface GymHour {
  id:         string;
  gym_id:     string;
  name:       string;
  hours:      string;
  sort_order: number;
}

export interface Profile {
  id: string;
  gym_id: string | null;
  name: string | null;
  avatar_url: string | null;
  role: 'OWNER' | 'CLIENT' | null;
  email: string | null;
  phone: string | null;
  cedula: string | null;
  created_at: string;
}

export interface GymPlan {
  id: string;
  gym_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  is_active: boolean;
  color: string;
  features: string[];
  access_type: 'unlimited' | 'limited';
  max_visits: number | null;
  created_at: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  gym_id: string;
  plan_id: string;
  start_date: string;
  expiration_date: string;
  next_payment_date: string;
  payment_status: 'active' | 'pending' | 'expired';
  is_current: boolean;
  created_at: string;
}

// ─── UI models (used by templates) ───────────────────────────────────────────

export interface MembershipPlan {
  name: string;
  price: number;
  nextPayment: string;
  status: 'active' | 'expired' | 'pending';
  expirationDate: string;
  daysRemaining: number;
  daysTotal: number;
  features: string[];
}

export interface Routine {
  id: string;
  routineId: string;
  dayNumber: number;
  name: string;
  day: string;
  dayLabel: string;
  setsCount: number;
  exercisesCount: number;
  active?: boolean;
  program?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  target: string;
  lastPerformance: string;
  sets: ExerciseSet[];
  description?: string;
  videoUrl?: string;
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  done: boolean;
}

export interface Payment {
  date: string;
  amount: string;
  rawAmount: number;
  method: string;
  status: 'paid' | 'pending' | 'overdue';
  plan?: string;
  ref?: string;
}

export interface Measurement {
  label: string;
  value: string;
  unit: string;
  delta: string;
}

export interface CalendarDay {
  n: number | null;
  done: boolean;
  planned: boolean;
  today: boolean;
}

export interface TodayWorkout {
  routineId:      string;
  routineName:    string;
  dayNumber:      number;
  totalDays:      number;
  exercisesCount: number;
  setsCount:      number;
  estimatedMins:  number;
}

export interface UpcomingWorkout {
  day: string;
  month: string;
  name: string;
  time: string;
}

export interface WeeklyStats {
  completed: number;
  total: number;
  streak: number;
}
