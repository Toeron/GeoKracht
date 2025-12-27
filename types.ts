export type WorkoutType = 'A' | 'B' | 'C';

export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  id: string; // generated
  name: string;
  workout_id: string;
  sets: ExerciseSet[];
  rest_time_seconds: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  workout_type: WorkoutType;
  date: string; // ISO Date string
  duration_minutes: number;
  notes: string;
  completed: boolean;
  exercises: Exercise[];
}

export interface WorkoutSnack {
  id: string;
  exercise_name: string;
  date: string;
  sets: ExerciseSet[];
  duration_minutes: number;
  completed: boolean;
}

export interface TemplateExercise {
  name: string;
  displayName: string;
  targetReps: string;
  sets: number;
  restTime: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string; // 'A', 'B', 'C'
  description: string;
  exercises: TemplateExercise[];
}

export interface User {
  id: string;
  name: string;
  language: 'nl' | 'en';
}

export type ThemeColor = 'lime' | 'pink' | 'orange' | 'cyan' | 'purple' | 'red' | 'green' | 'white';