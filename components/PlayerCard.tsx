import React from 'react';
import { BCard } from './ui/BrutalistComponents';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { GamificationStats } from '../types';

interface PlayerCardProps {
    stats: GamificationStats;
    name: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ stats, name }) => {
    return (
        <BCard color="black" className="relative overflow-hidden text-white border-4 border-lime-400">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-lime-400">
                            {stats.rankName}
                        </h2>
                        <p className="font-bold text-sm text-gray-400 uppercase">
                            Level {stats.level} • {name}
                        </p>
                    </div>
                    <div className="bg-lime-400 text-black px-3 py-1 font-black text-xl rounded rotate-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                        LVL {stats.level}
                    </div>
                </div>

                {/* XP Bar */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs font-black uppercase mb-1 text-gray-400">
                        <span>XP Progress</span>
                        <span>{stats.currentXP} / {stats.nextLevelXP} XP</span>
                    </div>
                    <div className="w-full h-6 bg-zinc-800 border-2 border-white skew-x-[-10deg] overflow-hidden p-1">
                        <div
                            className="h-full bg-lime-400 transition-all duration-1000 ease-out"
                            style={{ width: `${stats.progressPercent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white text-lime-400">
                            <Star size={16} />
                        </div>
                        <div className="leading-none">
                            <div className="text-xs font-bold text-gray-500 uppercase">Total XP</div>
                            <div className="font-black text-lg">{stats.currentXP + (stats.nextLevelXP * (stats.level - 1))}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white text-lime-400">
                            <TrendingUp size={16} />
                        </div>
                        <div className="leading-none">
                            <div className="text-xs font-bold text-gray-500 uppercase">Next Level</div>
                            <div className="font-black text-lg">{stats.nextLevelXP - stats.currentXP} XP</div>
                        </div>
                    </div>
                </div>
            </div>
        </BCard>
    );
};

export default PlayerCard;
