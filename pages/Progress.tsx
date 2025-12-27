import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BCard } from '../components/ui/BrutalistComponents';
import { getStoredWorkouts, calculateVolume } from '../utils';

const Progress = () => {
  const workouts = getStoredWorkouts();
  const completedWorkouts = workouts.filter(w => w.completed);

  // Real data generation
  // Sort Oldest -> Newest for Charts
  const data = completedWorkouts.slice().reverse().map(w => ({
    name: w.date.substring(5, 10),
    volume: w.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0),
    duration: w.duration_minutes
  }));

  const totalVolume = data.reduce((acc, d) => acc + d.volume, 0);

  // Calculate PRs
  const prMap = new Map<string, { weight: number, setStr: string, volume: number }>();
  
  completedWorkouts.forEach(w => {
    w.exercises.forEach(ex => {
        const current = prMap.get(ex.name) || { weight: 0, setStr: '-', volume: 0 };
        let sessionVol = 0;
        let maxW = current.weight;
        let bestS = current.setStr;
        
        ex.sets.forEach(s => {
            if(s.completed) {
                sessionVol += (s.weight * s.reps);
                if(s.weight > maxW) {
                    maxW = s.weight;
                    bestS = `${s.reps} x ${s.weight}kg`;
                } else if (s.weight === maxW && maxW > 0) {
                    // Check if current best string exists, compare reps
                    const curReps = parseInt(bestS.split(' ')[0]) || 0;
                    if (s.reps > curReps) {
                         bestS = `${s.reps} x ${s.weight}kg`;
                    }
                }
            }
        });
        
        prMap.set(ex.name, {
            weight: maxW,
            setStr: bestS,
            volume: Math.max(current.volume, sessionVol)
        });
    });
  });

  const prList = Array.from(prMap.entries()).map(([name, stats]) => ({
    name: name,
    w: `${stats.weight}kg`,
    s: stats.setStr,
    v: `${stats.volume}kg`
  })).filter(pr => parseInt(pr.w) > 0); // Only show exercises with actual data

  return (
    <div className="space-y-6">
      <BCard color="cyan">
        <h2 className="text-3xl font-black uppercase mb-2">JOUW VOORTGANG</h2>
        <p className="font-bold">Zie hoe je sterker wordt elke week</p>
      </BCard>

      <div className="grid grid-cols-3 gap-4">
         <BCard color="lime" className="p-2">
            <div className="text-xs font-bold uppercase">TRAIN</div>
            <div className="text-2xl font-black">{completedWorkouts.length}</div>
            <div className="text-xs font-bold">Voltooid</div>
         </BCard>
          <BCard color="pink" className="p-2">
            <div className="text-xs font-bold uppercase">AVG VOL</div>
            <div className="text-2xl font-black">{data.length > 0 ? (totalVolume/data.length/1000).toFixed(1) : 0}K</div>
            <div className="text-xs font-bold">kg / sessie</div>
         </BCard>
         <BCard color="purple" className="p-2">
            <div className="text-xs font-bold uppercase">VOLUME</div>
            <div className="text-2xl font-black">{(totalVolume/1000).toFixed(0)}K</div>
            <div className="text-xs font-bold">kg totaal</div>
         </BCard>
      </div>

      {/* Activity Chart */}
      {data.length > 0 && (
      <div className="bg-black p-4 rounded-lg border-4 border-black">
        <h3 className="text-lime-400 font-black uppercase text-xs mb-2">ACTIVITEIT (Duur in min)</h3>
        <div className="h-32 bg-white border-2 border-white">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ border: '2px solid black', fontWeight: 'bold' }}/>
                    <Bar dataKey="duration" fill="#a3e635" stroke="#000000" strokeWidth={2} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      )}

      {/* Volume Chart */}
      {data.length > 0 && (
      <div className="bg-black p-4 rounded-lg border-4 border-black">
        <h3 className="text-pink-500 font-black uppercase text-xs mb-2">VOLUME (Totaal kg)</h3>
        <div className="h-32 bg-white border-2 border-white">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                     <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                     <Tooltip contentStyle={{ border: '2px solid black', fontWeight: 'bold' }}/>
                    <Line type="monotone" dataKey="volume" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill:'#ec4899', stroke: 'black', strokeWidth: 2}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
      )}

      {data.length === 0 && (
          <BCard color="white" className="text-center py-8">
              <p className="font-bold text-gray-500">Voltooi je eerste training om statistieken te zien!</p>
          </BCard>
      )}

      {/* Personal Records List */}
      <div className="bg-yellow-400 border-4 border-black p-4 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
         <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
            🏆 PERSOONLIJKE RECORDS
         </h3>
         
         {prList.length > 0 ? (
         <div className="space-y-4">
            {prList.map((pr, idx) => (
                <div key={idx} className="bg-black p-3 text-white border-2 border-transparent">
                    <h4 className="text-lime-400 font-black uppercase mb-1">{pr.name}</h4>
                    <div className="grid grid-cols-1 gap-1 text-xs font-bold">
                        <div className="flex justify-between"><span>Max Gewicht:</span> <span className="text-lime-400">{pr.w}</span></div>
                        <div className="flex justify-between"><span>Beste Set:</span> <span className="text-lime-400">{pr.s}</span></div>
                        <div className="flex justify-between"><span>Max Volume:</span> <span className="text-lime-400">{pr.v}</span></div>
                    </div>
                </div>
            ))}
         </div>
         ) : (
             <div className="text-center font-bold text-black/50 py-4">Nog geen records beschikbaar</div>
         )}
      </div>
    </div>
  );
};

export default Progress;