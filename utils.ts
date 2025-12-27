import { format, parseISO } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Workout, WorkoutSnack, User, WorkoutTemplate } from './types';
import { DEFAULT_TEMPLATES } from './constants';

const STORAGE_KEYS = {
  WORKOUTS: 'geokracht_workouts',
  SNACKS: 'geokracht_snacks',
  TEMPLATES: 'geokracht_templates',
  USER: 'geokracht_user'
};

// --- Storage Helpers ---

export const getStoredWorkouts = (): Workout[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workout: Workout) => {
  const workouts = getStoredWorkouts();
  const existingIndex = workouts.findIndex(w => w.id === workout.id);
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.unshift(workout); // Add to beginning
  }
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const deleteStoredWorkout = (id: string) => {
  const workouts = getStoredWorkouts();
  const newWorkouts = workouts.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(newWorkouts));
};

export const getStoredSnacks = (): WorkoutSnack[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SNACKS);
  return data ? JSON.parse(data) : [];
};

export const saveSnack = (snack: WorkoutSnack) => {
  const snacks = getStoredSnacks();
  snacks.unshift(snack);
  localStorage.setItem(STORAGE_KEYS.SNACKS, JSON.stringify(snacks));
};

export const getTemplates = (): WorkoutTemplate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  return data ? JSON.parse(data) : DEFAULT_TEMPLATES;
};

export const saveTemplates = (templates: WorkoutTemplate[]) => {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const getUser = (): User => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : { id: 'u1', name: 'Athlete', language: 'nl' };
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// --- Logic Helpers ---

export const formatDate = (isoString: string, language: 'nl' | 'en' = 'nl') => {
  try {
    return format(parseISO(isoString), 'EEEE d MMMM', { locale: language === 'nl' ? nl : enUS });
  } catch (e) {
    return isoString;
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateVolume = (sets: { weight: number, reps: number, completed: boolean }[]) => {
  return sets.reduce((acc, set) => set.completed ? acc + (set.weight * set.reps) : acc, 0);
};