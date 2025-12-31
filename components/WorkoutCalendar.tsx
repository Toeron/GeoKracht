import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BCard, BButton } from './ui/BrutalistComponents';
import { Workout } from '../types';

interface WorkoutCalendarProps {
    workouts: Workout[];
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ workouts }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: nl });
    const endDate = endOfWeek(monthEnd, { locale: nl });

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

    const getDayWorkouts = (date: Date) => {
        return workouts.filter(w => isSameDay(new Date(w.date), date));
    };

    return (
        <BCard color="white" className="p-0 overflow-hidden border-4 border-black">
            {/* Calendar Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center">
                <button onClick={prevMonth} className="p-1 hover:bg-zinc-800 rounded transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <span className="font-black uppercase text-xl tracking-wider">
                    {format(currentMonth, 'MMMM yyyy', { locale: nl })}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-zinc-800 rounded transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-black text-xs uppercase text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        const dayWorkouts = getDayWorkouts(day);
                        const hasWorkout = dayWorkouts.length > 0;
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                  aspect-square border-2 border-black flex flex-col items-center justify-center relative
                  ${!isCurrentMonth ? 'opacity-20 bg-gray-100' : 'bg-white'}
                  ${isDayToday ? 'ring-2 ring-lime-400 ring-offset-2' : ''}
                `}
                            >
                                <span className={`text-xs font-bold mb-1 ${!isCurrentMonth ? 'text-gray-500' : 'text-black'}`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Workout Dots/Indicators */}
                                {hasWorkout && (
                                    <div className="flex flex-wrap gap-0.5 justify-center px-0.5">
                                        {dayWorkouts.map((w, i) => (
                                            <div
                                                key={i}
                                                className={`
                          w-3 h-3 rounded-full border border-black flex items-center justify-center text-[8px] font-black text-white
                          ${w.workout_type === 'A' ? 'bg-red-500' : 'bg-black'}
                        `}
                                                title={`Training ${w.workout_type}`}
                                            >
                                                {w.workout_type.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </BCard>
    );
};

export default WorkoutCalendar;
