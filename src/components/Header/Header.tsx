import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, History, HelpCircle, BarChart2 } from 'lucide-react'; 
import ThemeToggle from './ThemeToggle';
import StatsDrawer from '../Stats/StatsDrawer';
import InstructionsDrawer from '../Instructions/InstructionsDrawer';
import LeaderboardDrawer from '../Leaderboard/LeaderboardDrawer'; 
import { GameStats } from '../../types/game';
import Tooltip from '../Tooltip';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  stats: GameStats;
  setStats: (stats: GameStats) => void;
  onHomeClick: () => void;
  address?: `0x${string}`;
}

const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  stats,
  onHomeClick,
  address,
}) => {
  const { t } = useTranslation();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="fixed w-full z-50 top-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 space-x-4">
            <Tooltip content={t('returnToHome')}>
              <button
                onClick={onHomeClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                {!isMobile && (
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                    {t('title')}
                  </h1>
                )}
              </button>
            </Tooltip>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            <div className="flex items-center space-x-2">
              {/* Tombol Leaderboard Baru */}
              <Tooltip content={t('viewLeaderboard', 'View Leaderboard')}>
                <button
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <BarChart2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </Tooltip>

              <Tooltip content={t('viewHistory', 'View History')}>
                <button
                  onClick={() => setIsStatsOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <History className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </Tooltip>

              <Tooltip content={t('viewInstructions')}>
                <button
                  onClick={() => setIsInstructionsOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <HelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </Tooltip>

              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

              {address && (
                <div className="ml-2 header-account-button-wrapper">
                  <appkit-account-button balance="hide" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />
      <InstructionsDrawer
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
      
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </>
  );
};

export default Header;