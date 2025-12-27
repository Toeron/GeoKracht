import React, { useState } from 'react';
import { Coffee, Play, X, Zap } from 'lucide-react';
import { BCard, BButton, BInput } from '../components/ui/BrutalistComponents';
import { SNACK_OPTIONS } from '../constants';
import { saveSnack, generateId } from '../utils';
import { useNavigate } from 'react-router-dom';

const WorkoutSnacks = () => {
  const navigate = useNavigate();
  const [selectedSnack, setSelectedSnack] = useState<any | null>(null);
  const [sets, setSets] = useState([{ weight: 0, reps: 0, completed: false }, { weight: 0, reps: 0, completed: false }, { weight: 0, reps: 0, completed: false }]);

  const handleStartSnack = (snack: any) => {
    setSelectedSnack(snack);
    setSets([{ weight: 0, reps: 0, completed: false }, { weight: 0, reps: 0, completed: false }, { weight: 0, reps: 0, completed: false }]);
  };

  const handleSaveSnack = () => {
    if(!selectedSnack) return;
    
    saveSnack({
      id: generateId(),
      exercise_name: selectedSnack.displayName,
      date: new Date().toISOString(),
      duration_minutes: 5, // approx
      completed: true,
      sets: sets.map(s => ({ ...s, completed: true }))
    });

    setSelectedSnack(null);
    navigate('/'); // Back to dash to see update
  };

  const updateSet = (idx: number, field: 'weight'|'reps', val: number) => {
    const newSets = [...sets];
    newSets[idx][field] = val;
    setSets(newSets);
  };

  if (selectedSnack) {
    return (
      <div className="space-y-6">
        <BCard color="orange" className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black uppercase">{selectedSnack.displayName}</h2>
                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">{selectedSnack.target}</span>
              </div>
              <button onClick={() => setSelectedSnack(null)} className="p-2 border-4 border-black bg-red-500 text-white rounded"><X /></button>
            </div>
            <div className="mt-4 font-bold text-sm">
                3 sets • {selectedSnack.reps} • 5-10 minutes
            </div>
        </BCard>

        <BCard color="white">
            <div className="space-y-4">
              {sets.map((set, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                    <div className="w-8 font-black text-xl">#{idx + 1}</div>
                    <BInput 
                        type="number" 
                        placeholder="KG" 
                        onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value))}
                    />
                    <BInput 
                        type="number" 
                        placeholder="Reps" 
                        onChange={(e) => updateSet(idx, 'reps', parseFloat(e.target.value))}
                    />
                </div>
              ))}
            </div>
            <BButton variant="orange" className="w-full mt-6" onClick={handleSaveSnack}>
                COMPLETE SNACK
            </BButton>
        </BCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BCard color="orange" className="border-b-8">
        <h2 className="text-3xl font-black uppercase mb-2">WORKOUT SNACKS</h2>
        <p className="font-bold">Snelle 3-set oefeningen voor extra gains.</p>
      </BCard>

      <div className="bg-black text-orange-500 p-4 border-4 border-black rounded-lg">
        <h3 className="font-black text-lg uppercase mb-2">WAAROM SNACKS?</h3>
        <ul className="space-y-2 text-sm font-bold text-white">
            <li className="flex gap-2"><Coffee size={16} className="text-orange-500"/> 5-10 minuten per sessie</li>
            <li className="flex gap-2"><Zap size={16} className="text-orange-500"/> Extra volume zonder overtraining</li>
            <li className="flex gap-2"><Play size={16} className="text-orange-500"/> Perfecte pump voor motivatie</li>
        </ul>
      </div>

      <div className="grid gap-4">
        {SNACK_OPTIONS.map((snack, idx) => (
          <BCard key={idx} color="white" className="flex flex-col items-center text-center gap-2 group cursor-pointer" onClick={() => handleStartSnack(snack)}>
             <h3 className="font-black text-xl uppercase">{snack.displayName}</h3>
             <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{snack.target}</span>
             <p className="font-black text-lg">{snack.reps}</p>
             <p className="text-xs font-bold text-gray-500">{snack.desc}</p>
             <div className="mt-2 text-xs font-black uppercase flex items-center gap-1">
                <Zap size={12}/> 3 min rust
             </div>
          </BCard>
        ))}
      </div>
    </div>
  );
};

export default WorkoutSnacks;