import React, { useState, useEffect } from 'react';
import { getStoredWorkouts, deleteStoredWorkout, formatDate, calculateVolume } from '../utils';
import { BCard } from '../components/ui/BrutalistComponents';
import { Clock, Calendar, Trash2, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { Workout } from '../types';
import WorkoutCalendar from '../components/WorkoutCalendar';

const History = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getStoredWorkouts();
      setWorkouts(data);
    };
    fetchWorkouts();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await deleteStoredWorkout(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  // Sort by date desc
  const historyItems = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <BCard color="purple" className="text-center py-6">
        <h2 className="text-3xl font-black uppercase text-white mb-2">TRAINING GESCHIEDENIS</h2>
        <p className="font-bold text-white opacity-90">Al je voltooide trainingen op een rij</p>
      </BCard>

      <WorkoutCalendar workouts={workouts} />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4">
        <BCard color="lime" className="text-center py-2">
          <div className="text-2xl font-black">{workouts.length}</div>
          <div className="text-[10px] font-bold uppercase">Voltooide Trainingen</div>
        </BCard>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => {
          const volume = item.exercises.reduce((acc: number, ex: any) => acc + calculateVolume(ex.sets), 0);
          const isExpanded = expandedId === item.id;

          return (
            <BCard key={item.id} color="white" className="border-4 border-black p-0 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b-4 border-black">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-black text-xl uppercase">TRAINING {item.workout_type} (FULL BODY)</span>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase text-white">
                  <span className="bg-black px-2 py-1 flex items-center gap-1 rounded">
                    <Calendar size={10} /> {formatDate(item.date)}
                  </span>
                  <span className="bg-blue-500 px-2 py-1 flex items-center gap-1 rounded">
                    <Clock size={10} /> {item.duration_minutes} min
                  </span>
                  <span className="bg-green-500 px-2 py-1 flex items-center gap-1 rounded">
                    VOLTOOID
                  </span>
                </div>
              </div>

              {/* Body Summary */}
              <div className={`p-4 flex justify-between items-center transition-colors ${isExpanded ? 'bg-gray-100 border-b-4 border-black' : 'bg-gray-50'}`}>
                <div>
                  <div className="text-2xl font-black">{volume}kg</div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Volume</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(e, item.id)}
                    className="bg-cyan-400 border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 rounded transition-all"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="bg-red-500 text-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 rounded transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-4">
                    {item.exercises.map((ex, idx) => (
                      <div key={idx} className="border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <h4 className="font-black text-sm uppercase mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-2"><Dumbbell size={16} /> {ex.name}</span>
                          <span className="text-xs bg-lime-400 px-2 py-0.5 rounded text-black border border-black">{calculateVolume(ex.sets)}kg</span>
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-[10px] font-black uppercase text-center bg-black text-white p-1 mb-1 rounded-t">
                          <div>SET</div>
                          <div>KG</div>
                          <div>REPS</div>
                        </div>
                        {ex.sets.map((set, sIdx) => (
                          <div key={sIdx} className={`grid grid-cols-3 gap-2 text-xs text-center py-1 font-bold ${sIdx % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                            <div className="flex items-center justify-center">
                              <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]">{sIdx + 1}</span>
                            </div>
                            <div>{set.weight}</div>
                            <div>{set.reps}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </BCard>
          );
        })}
        {historyItems.length === 0 && (
          <div className="text-center font-bold text-gray-500 py-8">Geen trainingen gevonden</div>
        )}
      </div>
    </div>
  );
};

export default History;