import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Check, RotateCcw, Save, Timer, X, Plus, Minus } from 'lucide-react';
import { BCard, BButton, BInput } from '../components/ui/BrutalistComponents';
import { getTemplates, saveWorkout, generateId, formatDate, getStoredWorkouts } from '../utils';
import { WorkoutTemplate, Workout as WorkoutType, Exercise } from '../types';

const Workout = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);
  // State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  // Rest Timer State
  const [restTimer, setRestTimer] = useState<{ active: boolean, remaining: number, total: number } | null>(null);

  // Global Timer (Workout Duration)
  useEffect(() => {
    let interval: any;
    if (activeWorkout && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, startTime]);

  // Audio Helper
  const playBeep = (freq = 800, duration = 0.15) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  // Rest Timer Effect
  useEffect(() => {
    let interval: any;

    if (restTimer && restTimer.active) {
      // Auto-close when time is up
      if (restTimer.remaining === 0) {
        playBeep(1200, 0.3); // Final "Go" beep
        // Small delay to let the user see "GO" or "0"
        const timeout = setTimeout(() => {
          setRestTimer(null);
        }, 500);
        return () => clearTimeout(timeout);
      }

      // Beep logic for last 5 seconds (5, 4, 3, 2, 1)
      if (restTimer.remaining <= 5 && restTimer.remaining > 0) {
        playBeep(restTimer.remaining <= 3 ? 1000 : 800);
      }

      // Countdown interval
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (!prev) return null;
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startWorkout = async (template: WorkoutTemplate) => {
    setLoading(true);
    // Get stored workouts to find previous stats
    const storedWorkouts = await getStoredWorkouts();
    // Find the most recent completed workout of this type
    const lastWorkout = storedWorkouts.find(w => w.workout_type === template.name && w.completed);

    const newWorkout: WorkoutType = {
      id: generateId(),
      workout_type: template.name as any,
      date: new Date().toISOString(),
      duration_minutes: 0,
      notes: '',
      completed: false,
      exercises: template.exercises.map(e => {
        // Find corresponding exercise in last workout by name/displayName
        const lastExercise = lastWorkout?.exercises.find(le => le.name === e.displayName);

        return {
          id: generateId(),
          name: e.displayName,
          workout_id: '',
          // Use the template's rest time. Default to 90s only if undefined.
          rest_time_seconds: e.restTime !== undefined ? e.restTime : 90,
          completed: false,
          sets: Array(e.sets).fill(null).map((_, sIdx) => {
            // Use last workout stats if available, otherwise 0
            const lastSet = lastExercise?.sets[sIdx];
            return {
              reps: lastSet ? lastSet.reps : 0,
              weight: lastSet ? lastSet.weight : 0,
              completed: false
            };
          })
        };
      })
    };
    setActiveWorkout(newWorkout);
    setStartTime(new Date());
    setActiveExerciseIndex(0);
    setLoading(false);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];

    const wasCompleted = updatedExercises[exerciseIndex].sets[setIndex].completed;
    updatedExercises[exerciseIndex].sets[setIndex].completed = !wasCompleted;

    // Check if exercise is complete
    const allSetsDone = updatedExercises[exerciseIndex].sets.every(s => s.completed);
    updatedExercises[exerciseIndex].completed = allSetsDone;

    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });

    // Trigger Rest Timer if we just finished a set (and didn't uncheck it)
    if (!wasCompleted) {
      const isLastExercise = exerciseIndex === activeWorkout.exercises.length - 1;
      const isLastSet = setIndex === updatedExercises[exerciseIndex].sets.length - 1;

      // Don't trigger timer on the very last set of the workout
      if (!(isLastExercise && isLastSet)) {
        const restTime = updatedExercises[exerciseIndex].rest_time_seconds;
        // Trigger timer if rest time is greater than 0
        if (restTime !== undefined && restTime > 0) {
          setRestTimer({ active: true, remaining: restTime, total: restTime });
        }
      }
    }
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return;
    setLoading(true);
    const finishedWorkout = {
      ...activeWorkout,
      completed: true,
      duration_minutes: Math.floor(elapsed / 60)
    };
    await saveWorkout(finishedWorkout);
    navigate('/history');
  };

  // Rest Timer Helpers
  const adjustRestTime = (seconds: number) => {
    if (restTimer) {
      setRestTimer({ ...restTimer, remaining: Math.max(0, restTimer.remaining + seconds) });
    }
  };

  const skipRest = () => {
    setRestTimer(null);
  };

  // --- SELECTION VIEW ---
  if (!activeWorkout) {
    return (
      <div className="space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center font-black uppercase text-xl animate-pulse">
            Syncing...
          </div>
        )}
        <BCard color="pink" className="text-center py-8">
          <h2 className="text-3xl font-black uppercase mb-2">START TRAINING</h2>
          <p className="font-bold">Kies je training en begin met sterker worden</p>
        </BCard>

        {templates.map((template) => (
          <BCard key={template.id} color="white" className="relative group">
            <div className={`absolute top-0 left-0 w-full h-4 ${template.name === 'A' ? 'bg-red-500' : template.name === 'B' ? 'bg-white' : 'bg-white'} border-b-4 border-black`}></div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-black uppercase">TRAINING {template.name}</h3>
                <span className="bg-black text-white px-3 py-1 text-xs font-bold rounded-full">Training {template.name}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {template.exercises.map((ex, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-bold">
                    <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">{idx + 1}</span>
                    {ex.displayName}
                  </li>
                ))}
              </ul>

              <BButton onClick={() => startWorkout(template)} className="w-full">
                START SESSION
              </BButton>
            </div>
          </BCard>
        ))}
      </div>
    );
  }

  // --- ACTIVE WORKOUT VIEW ---
  const currentExercise = activeWorkout.exercises[activeExerciseIndex];

  return (
    <div className="h-full flex flex-col relative">
      {/* Rest Timer Overlay */}
      {restTimer && restTimer.active && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-200">
          <div className="absolute top-6 right-6">
            <button onClick={skipRest} className="p-2 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
              <X size={24} />
            </button>
          </div>

          <p className="font-black text-xl uppercase mb-8 tracking-widest text-gray-400">Rest Timer</p>

          <div className={`font-black text-8xl mb-4 font-mono tabular-nums tracking-tighter ${restTimer.remaining <= 10 ? 'text-red-500 animate-pulse' : 'text-lime-400'}`}>
            {restTimer.remaining === 0 ? "GO!" : formatTime(restTimer.remaining)}
          </div>

          <p className="font-bold text-sm text-gray-400 mb-12">Next: {currentExercise.sets.filter(s => !s.completed).length > 0 ? 'Next Set' : 'Next Exercise'}</p>

          <div className="flex gap-4 mb-6 w-full max-w-xs">
            <BButton variant="dark" onClick={() => adjustRestTime(-10)} className="flex-1 border-white border-2">
              <Minus size={16} /> 10s
            </BButton>
            <BButton variant="dark" onClick={() => adjustRestTime(30)} className="flex-1 border-white border-2">
              <Plus size={16} /> 30s
            </BButton>
          </div>

          <BButton variant="primary" onClick={skipRest} className="w-full max-w-xs">
            {restTimer.remaining === 0 ? "GO!" : "SKIP REST"}
          </BButton>
        </div>
      )}

      {/* Sticky Header for Timer/Nav */}
      <div className="sticky top-0 z-20 bg-gray-100 pb-4 pt-2 border-b-4 border-black mb-4 flex justify-between items-center">
        <div className="font-black text-2xl font-mono">{formatTime(elapsed)}</div>
        <BButton variant="danger" className="py-1 px-3 text-xs" onClick={() => { if (confirm('Quit?')) setActiveWorkout(null) }}>QUIT</BButton>
        <BButton variant="success" className="py-1 px-3 text-xs" onClick={finishWorkout}>FINISH</BButton>
      </div>

      <div className="space-y-6 pb-20">
        {/* Exercise Navigator */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {activeWorkout.exercises.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setActiveExerciseIndex(idx)}
              className={`flex-shrink-0 w-10 h-10 border-4 border-black font-bold flex items-center justify-center rounded-lg transition-all ${activeExerciseIndex === idx
                ? 'bg-lime-400 -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : ex.completed ? 'bg-green-500 text-white' : 'bg-white'
                }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Active Exercise Card */}
        <BCard color="white" className="relative min-h-[50vh]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase break-words max-w-[200px]">{currentExercise.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Timer size={14} />
                <span className="font-bold text-gray-500 text-xs">{currentExercise.rest_time_seconds}s rest</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-lg">{currentExercise.sets.length} SETS</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 font-black text-xs uppercase mb-1 text-center">
              <div className="col-span-2">Set</div>
              <div className="col-span-4">KG</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-2">Done</div>
            </div>

            {currentExercise.sets.map((set, sIdx) => (
              <div key={sIdx} className={`grid grid-cols-12 gap-2 items-center ${set.completed ? 'opacity-50' : ''} transition-opacity`}>
                <div className="col-span-2 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {sIdx + 1}
                  </div>
                </div>
                <div className="col-span-4">
                  <BInput
                    type="number"
                    placeholder="0"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'weight', parseFloat(e.target.value))}
                    className="text-center bg-zinc-800 text-white placeholder-zinc-500 border-black"
                  />
                </div>
                <div className="col-span-4">
                  <BInput
                    type="number"
                    placeholder="0"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(activeExerciseIndex, sIdx, 'reps', parseFloat(e.target.value))}
                    className="text-center bg-zinc-800 text-white placeholder-zinc-500 border-black"
                  />
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => toggleSetComplete(activeExerciseIndex, sIdx)}
                    className={`w-10 h-10 border-4 border-black rounded flex items-center justify-center transition-all ${set.completed ? 'bg-green-500 shadow-none translate-y-1 translate-x-1' : 'bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                  >
                    {set.completed && <Check strokeWidth={4} color="white" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {activeExerciseIndex < activeWorkout.exercises.length - 1 ? (
              <BButton onClick={() => setActiveExerciseIndex(prev => prev + 1)}>
                Next Exercise
              </BButton>
            ) : (
              <BButton variant="success" onClick={finishWorkout}>
                <Save size={18} /> Finish Workout
              </BButton>
            )}
          </div>
        </BCard>
      </div>
    </div>
  );
};

export default Workout;