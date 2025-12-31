import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Zap, TrendingUp } from 'lucide-react';
import { isSameWeek, parseISO, differenceInCalendarWeeks } from 'date-fns';
import { Session } from '@supabase/supabase-js';
import { BCard } from '../components/ui/BrutalistComponents';
import { getStoredWorkouts, formatDate, getProfile, calculateGamificationStats } from '../utils';
import { Workout } from '../types';
import { TRANSLATIONS } from '../constants';
import PlayerCard from '../components/PlayerCard';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const { session } = useOutletContext<{ session: Session }>();
  const [userName, setUserName] = useState<string>(session?.user?.user_metadata?.name || 'Athlete');

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fetchData = async () => {
      const wData = await getStoredWorkouts();
      setWorkouts(wData);

      const p = await getProfile();
      if (p) {
        setLanguage(p.language as 'nl' | 'en');
        if (p.name) setUserName(p.name);
      }
    };
    fetchData();
  }, [session]);

  const completedWorkouts = workouts.filter(w => w.completed);

  // Real Stats Calculation
  const now = new Date();

  // Workouts this week
  const thisWeekCount = completedWorkouts.filter(w =>

    isSameWeek(parseISO(w.date), now, { weekStartsOn: 1 })
  ).length;

  // Streak Calculation (Consecutive Weeks Active)
  let streak = 0;
  if (completedWorkouts.length > 0) {
    // Sort desc (newest first)
    const sorted = [...completedWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastDate = parseISO(sorted[0].date);

    // If last workout was more than 1 week ago (not this week or last week), streak is 0
    if (differenceInCalendarWeeks(now, lastDate, { weekStartsOn: 1 }) <= 1) {
      streak = 1;
      let currentWeekDate = lastDate;

      for (let i = 0; i < sorted.length; i++) {
        const d = parseISO(sorted[i].date);
        const diff = differenceInCalendarWeeks(currentWeekDate, d, { weekStartsOn: 1 });

        if (diff === 0) continue; // Same week
        if (diff === 1) {
          streak++;
          currentWeekDate = d;
        } else {
          // If gap is more than 1 week, streak ends
          if (diff > 1) break;
        }
      }
    }
  }

  const lastWorkout = workouts[0];
  const nextTraining = lastWorkout?.workout_type === 'A' ? 'B' : lastWorkout?.workout_type === 'B' ? 'C' : 'A';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <h2 className="font-black text-3xl uppercase tracking-tighter">
        WELCOME {userName}
      </h2>

      {/* Gamification Player Card */}
      <PlayerCard stats={calculateGamificationStats(workouts)} name={userName} />

      {/* Stats Grid - Responsive: 1 col mobile, 3 cols tablet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BCard color="orange" className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase mb-2">
              <Calendar size={14} /> {t.week}
            </div>
            <div className="text-4xl font-black">{thisWeekCount}</div>
            <div className="font-bold text-sm">{t.workouts}</div>
          </div>
        </BCard>
        <BCard color="cyan" className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase mb-2">
              <Zap size={14} /> NEXT
            </div>
            <div className="text-3xl font-black leading-tight mb-1">Training {nextTraining}</div>
            <div className="font-bold text-xs">Ready for action</div>
          </div>
        </BCard>
        <BCard color="purple" className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase mb-2">
              <TrendingUp size={14} /> {t.streak}
            </div>
            <div className="text-4xl font-black">{streak}</div>
            <div className="font-bold text-sm">Weeks Consistent</div>
          </div>
        </BCard>
      </div>

      {/* Recent Workouts List */}
      <div className="space-y-4">
        <div className="bg-black text-lime-400 p-3 -mx-4 sm:mx-0 sm:rounded-lg border-y-4 sm:border-4 border-black">
          <h3 className="font-black text-lg uppercase tracking-wide">{t.recent}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedWorkouts.slice(0, 5).map((workout) => (
            <BCard key={workout.id} color="white" className="flex items-center justify-between py-4">
              <div>
                <h4 className="font-black text-lg">Training {workout.workout_type}</h4>
                <p className="text-xs font-bold text-gray-600">{formatDate(workout.date, language)}</p>
                <p className="text-xs font-bold text-gray-500">{workout.duration_minutes} minutes</p>
              </div>
              <div className="bg-lime-400 border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wider">
                {t.completed}
              </div>
            </BCard>
          ))}
        </div>

        {completedWorkouts.length === 0 && (
          <div className="text-center font-bold text-gray-500 py-4">No recent workouts</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;