import { WorkoutTemplate, WorkoutSnack } from './types';

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'A',
    name: 'A',
    description: 'Full Body - Press Focus',
    exercises: [
      { name: 'seated_oh_press', displayName: 'Seated OH Press', targetReps: '10-15', sets: 3, restTime: 180 },
      { name: 'pull_up', displayName: 'Pull-up', targetReps: '5-10', sets: 3, restTime: 180 },
      { name: 'lateral_raises', displayName: 'Lateral Raises', targetReps: '10-15', sets: 3, restTime: 180 },
      { name: 'squat', displayName: 'Squat', targetReps: '8-12', sets: 3, restTime: 180 },
      { name: 'incline_db_press', displayName: 'Incline Dumbbell Press', targetReps: '10-15', sets: 3, restTime: 180 },
    ]
  },
  {
    id: 'B',
    name: 'B',
    description: 'Full Body - Pull Focus',
    exercises: [
      { name: 'pull_up', displayName: 'Pull-up', targetReps: 'Failure', sets: 3, restTime: 180 },
      { name: 'seated_oh_press', displayName: 'Seated OH Press', targetReps: '8-12', sets: 3, restTime: 180 },
      { name: 'deadlift', displayName: 'Deadlift', targetReps: '5-8', sets: 3, restTime: 180 },
      { name: 'incline_db_press', displayName: 'Incline Dumbbell Press', targetReps: '8-12', sets: 3, restTime: 180 },
      { name: 'seated_row', displayName: 'Seated Row', targetReps: '10-15', sets: 3, restTime: 180 },
    ]
  },
  {
    id: 'C',
    name: 'C',
    description: 'Full Body - Core & Stability',
    exercises: [
      { name: 'seated_oh_press', displayName: 'Seated OH Press', targetReps: '10-15', sets: 2, restTime: 180 },
      { name: 'pull_up', displayName: 'Pull-up', targetReps: 'Failure', sets: 2, restTime: 180 },
      { name: 'abs_roller', displayName: 'Abs Roller', targetReps: '5-10', sets: 2, restTime: 180 },
      { name: 'squat', displayName: 'Squat', targetReps: '8-12', sets: 2, restTime: 180 },
      { name: 'seated_row', displayName: 'Seated Row', targetReps: '10-15', sets: 2, restTime: 180 },
      { name: 'incline_db_press', displayName: 'Incline Dumbbell Press', targetReps: '10-15', sets: 2, restTime: 180 },
    ]
  }
];

export const SNACK_OPTIONS = [
  { name: 'biceps_curl', displayName: 'Biceps Curl', target: 'Biceps', reps: '10-15', desc: 'Klassieke biceps curl voor armkracht' },
  { name: 'triceps_pushdown', displayName: 'Triceps Pushdown', target: 'Triceps', reps: '10-15', desc: 'Triceps extensie aan de kabel' },
  { name: 'dips', displayName: 'Dips', target: 'Triceps/Borst', reps: '8-12', desc: 'Lichaamsgewicht dips voor kracht' },
  { name: 'seated_row', displayName: 'Seated Row', target: 'Rug', reps: '10-15', desc: 'Roeien voor rugkracht en houding' },
  { name: 'abs_roller', displayName: 'Abs Roller', target: 'Core', reps: '8-15', desc: 'Intensieve core training' },
  { name: 'lateral_raises', displayName: 'Lateral Raises', target: 'Schouders', reps: '12-15', desc: 'Schouderbreedte ontwikkelen' },
];

export const TRANSLATIONS = {
  nl: {
    welcome: 'WELCOME BACK',
    resume: 'RESUME TRAINING',
    start: 'START TRAINING',
    snacks: 'Workout Snacks',
    templates: 'Workout Templates',
    progress: 'PROGRESS',
    history: 'TRAINING GESCHIEDENIS',
    week: 'THIS WEEK',
    streak: 'STREAK',
    workouts: 'Workouts',
    completed: 'COMPLETED',
    recent: 'RECENT WORKOUTS',
    dashboard: 'Dashboard',
    training: 'Training',
    settings: 'Settings',
    finish: 'Finish',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    newTemplate: 'Nieuw Template Maken',
    startSnack: 'START SNACK',
    volume: 'VOLUME',
    records: 'PERSOONLIJKE RECORDS',
    maxWeight: 'Max Gewicht',
    bestSet: 'Beste Set',
    maxVolume: 'Max Volume',
    kg: 'kg',
    min: 'min',
    reps: 'reps',
  },
  en: {
    welcome: 'WELCOME BACK',
    resume: 'RESUME TRAINING',
    start: 'START TRAINING',
    snacks: 'Workout Snacks',
    templates: 'Workout Templates',
    progress: 'PROGRESS',
    history: 'WORKOUT HISTORY',
    week: 'THIS WEEK',
    streak: 'STREAK',
    workouts: 'Workouts',
    completed: 'COMPLETED',
    recent: 'RECENT WORKOUTS',
    dashboard: 'Dashboard',
    training: 'Training',
    settings: 'Settings',
    finish: 'Finish',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    newTemplate: 'Create New Template',
    startSnack: 'START SNACK',
    volume: 'VOLUME',
    records: 'PERSONAL RECORDS',
    maxWeight: 'Max Weight',
    bestSet: 'Best Set',
    maxVolume: 'Max Volume',
    kg: 'kg',
    min: 'min',
    reps: 'reps',
  }
};