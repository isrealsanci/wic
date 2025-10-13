import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface LeaderboardEntry {
  username: string;
  pfp_url: string;
  score: number;
  wins: number;
  losses: number;
}

interface LeaderboardListProps {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 dark:text-red-400">{error}</div>;
  }
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400 dark:text-gray-300';
    if (rank === 3) return 'text-yellow-600 dark:text-yellow-700';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {data.map((player, index) => (
          <li key={player.username + index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="flex items-center space-x-4 flex-1">
                <span className={`w-6 text-lg font-bold text-center ${getRankColor(index + 1)}`}>{index + 1}</span>
                <img
                    src={player.pfp_url || `https://api.dicebear.com/8.x/initials/svg?seed=${player.username}`}
                    alt={player.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{player.username}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><TrendingUp className="w-3 h-3 text-green-500 mr-1"/>{player.wins} W</span>
                        <span className="flex items-center"><TrendingDown className="w-3 h-3 text-red-500 mr-1"/>{player.losses} L</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{player.score}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardList;