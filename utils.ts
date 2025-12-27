import { format, parseISO } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Workout, WorkoutSnack, User, WorkoutTemplate } from './types';
import { DEFAULT_TEMPLATES } from './constants';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  WORKOUTS: 'geokracht_workouts',
  SNACKS: 'geokracht_snacks',
  TEMPLATES: 'geokracht_templates',
  USER: 'geokracht_user'
};

// --- Storage Helpers (Supabase) ---

export const getStoredWorkouts = async (): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises (*, sets (*))
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }

  // Map Supabase structure back to our Workout type if necessary
  return (data || []).map((w: any) => ({
    ...w,
    exercises: w.exercises?.sort((a: any, b: any) => a.order - b.order).map((e: any) => ({
      ...e,
      sets: e.sets?.sort((a: any, b: any) => a.order - b.order) || []
    })) || []
  }));
};

export const saveWorkout = async (workout: Workout) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .upsert({
      id: workout.id.length > 20 ? workout.id : undefined, // Check if it's a UUID or custom ID
      user_id: user.id,
      workout_type: workout.workout_type,
      date: workout.date,
      duration_minutes: workout.duration_minutes,
      notes: workout.notes,
      completed: workout.completed
    })
    .select()
    .single();

  if (workoutError) {
    console.error('Error saving workout:', workoutError);
    return;
  }

  const workoutId = workoutData.id;

  // Save exercises and sets
  for (let i = 0; i < workout.exercises.length; i++) {
    const ex = workout.exercises[i];
    const { data: exData, error: exError } = await supabase
      .from('exercises')
      .upsert({
        id: ex.id.length > 20 ? ex.id : undefined,
        workout_id: workoutId,
        name: ex.name,
        rest_time_seconds: ex.rest_time_seconds,
        completed: ex.completed,
        order: i
      })
      .select()
      .single();

    if (exError) continue;

    const exId = exData.id;
    const setsToSave = ex.sets.map((s, sIdx) => ({
      exercise_id: exId,
      reps: s.reps,
      weight: s.weight,
      completed: s.completed,
      order: sIdx
    }));

    await supabase.from('sets').delete().eq('exercise_id', exId);
    await supabase.from('sets').insert(setsToSave);
  }
};

export const deleteStoredWorkout = async (id: string) => {
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) console.error('Error deleting workout:', error);
};

// --- Templates & Snacks ---
// Keeping some local for now or migrating if tables exist

export const getTemplates = async (): Promise<WorkoutTemplate[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return DEFAULT_TEMPLATES;
  }

  if (!data || data.length === 0) {
    return DEFAULT_TEMPLATES;
  }

  return data.map((t: any) => ({
    ...t,
    exercises: t.exercises || []
  }));
};

export const saveTemplates = async (templates: WorkoutTemplate[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const t of templates) {
    await supabase.from('templates').upsert({
      id: t.id.length > 20 ? t.id : undefined,
      user_id: user.id,
      name: t.name,
      description: t.description,
      exercises: t.exercises
    });
  }
};

export const deleteTemplate = async (id: string) => {
  await supabase.from('templates').delete().eq('id', id);
};

export const getStoredSnacks = async (): Promise<WorkoutSnack[]> => {
  const { data, error } = await supabase
    .from('snacks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching snacks:', error);
    return [];
  }
  return data || [];
};

export const saveSnack = async (snack: Omit<WorkoutSnack, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('snacks').insert({
    ...snack,
    user_id: user.id
  });
};

export const getProfile = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.full_name || 'Athlete',
    language: data.language || 'nl'
  };
};

export const updateProfile = async (profile: Partial<User>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('profiles').upsert({
    id: user.id,
    full_name: profile.name,
    language: profile.language,
    updated_at: new Date().toISOString()
  });
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