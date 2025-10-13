import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trophy } from 'lucide-react';
import Drawer from '../Drawer';
import LeaderboardList, { LeaderboardEntry } from './LeaderboardList';

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardDrawer: React.FC<LeaderboardDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    if (isOpen) {
      const fetchLeaderboard = async () => {
        setIsLoading(true);
        setError(null);
        try {
          
          const response = await fetch('/api/leaderboard'); 
          if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data.');
          }
          const data: LeaderboardEntry[] = await response.json();
          setLeaderboardData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchLeaderboard();
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Trophy className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('leaderboardTitle', 'Leaderboard')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <LeaderboardList data={leaderboardData} isLoading={isLoading} error={error} />
      </div>
    </Drawer>
  );
};

export default LeaderboardDrawer;