import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import GuessForm from './components/OnGame/GuessForm';
import GuessList from './components/OnGame/GuessList';
import GameOverStatus from './components/OnGame/GameOverStatus';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import DifficultySelector from './components/DifficultySelector';
import { ConnectWallet } from './components/Connect';
import GameStats from './components/Stats/GameStats';
import { generateRandomNumber, checkGuess } from './utils/gameLogic';
import { Difficulty } from './types/game';
import { DIFFICULTY_CONFIG } from './utils/gameConfig';
import { getGameStats, saveGameResult } from './utils/storage';
import { submitGameResult } from './utils/api';
import './i18n/config';
import { LockCodeIcon } from './components/icons/LockCodeIcon';
import { sdk } from "@farcaster/miniapp-sdk";

interface GameProps {
  address?: `0x${string}`;
}

function Game({ address }: GameProps) {
  const [targetNumber, setTargetNumber] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Array<{ number: string; matches: number; positions: number }>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [stats, setStats] = useState(() => getGameStats());
  const [isMobile, setIsMobile] = useState(false);

  const [chances, setChances] = useState(0);
  const [nextClaimTime, setNextClaimTime] = useState<number | null>(null);
  const COOLDOWN_HOURS = 6;

  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const storedChances = localStorage.getItem('gameChances');
    const storedNextClaimTime = localStorage.getItem('nextClaimTime');
    if (storedChances) {
      setChances(parseInt(storedChances, 10));
    }
    if (storedNextClaimTime) {
      const nextTime = parseInt(storedNextClaimTime, 10);
      if (Date.now() > nextTime) {
        setNextClaimTime(null);
        localStorage.removeItem('nextClaimTime');
      } else {
        setNextClaimTime(nextTime);
      }
    }
  }, []);


  const startNewGame = () => {
    if (chances <= 0) {
      alert("You are out of chances! Please claim more.");
      return;
    }
    const newChances = chances - 1;
    setChances(newChances);
    localStorage.setItem('gameChances', newChances.toString());

    setTargetNumber(generateRandomNumber());
    setCurrentGuess('');
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setError('');
    setGameStarted(true);
  };

  const returnToHome = () => {
    setGameStarted(false);
    setCurrentGuess('');
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setError('');
  };

  const handleClaimChances = () => {
    const newChances = chances + 3;
    const nextClaim = Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000;

    setChances(newChances);
    setNextClaimTime(nextClaim);

    localStorage.setItem('gameChances', newChances.toString());
    localStorage.setItem('nextClaimTime', nextClaim.toString());
  };

  const handleGuess = () => {
    if (currentGuess.length !== 3) {
      setError(t('invalidNumber'));
      return;
    }

    const result = checkGuess(currentGuess, targetNumber);
    const newGuess = {
      number: currentGuess,
      matches: result.matches,
      positions: result.positions,
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setError('');

    const config = DIFFICULTY_CONFIG[difficulty];
    let gameResult: 'win' | 'loss' | null = null;

    if (currentGuess === targetNumber) {
      setWon(true);
      setGameOver(true);
      const newStats = saveGameResult(difficulty, newGuesses.length, true, config.winPoints, targetNumber)
      setStats(newStats);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      gameResult = 'win';
    } else if (newGuesses.length >= config.attempts) {
      setGameOver(true);
      const newStats = saveGameResult(difficulty, newGuesses.length, false, config.losePoints, targetNumber);
      setStats(newStats);
      gameResult = 'loss';
    }

    if (gameResult && address) {
      submitGameResult(address, gameResult, difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-math-pattern bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        stats={stats}
        setStats={setStats}
        onHomeClick={returnToHome}
        address={address}
      />

      <div className="pt-32 p-4 sm:p-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200 md:my-16 sm:my-10">
          <div className="p-6 sm:p-8">
            {!gameStarted ? (
              <div className="space-y-8">
                <div className="flex justify-center items-center space-x-2 text-5xl">
                  <LockCodeIcon className={'size-40 '} />
                </div>
                {isMobile && (
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap text-center">
                    {t('title')}
                  </h1>
                )}
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">Chances: {chances}</p>
                  {nextClaimTime ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Next claim at: {new Date(nextClaimTime).toLocaleTimeString()}
                    </p>
                  ) : (
                    <button
                      onClick={handleClaimChances}
                      className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Claim 3 Chances
                    </button>
                  )}
                </div>
                <GameStats stats={stats} />
                <DifficultySelector
                  selected={difficulty}
                  onSelect={setDifficulty}
                />
                <div className="text-center">
                  <button
                    onClick={startNewGame}
                    className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                    disabled={chances <= 0}
                  >
                    {t('startGame')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!gameOver && (
                  <div className="text-center mb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('attemptsRemaining')}: {DIFFICULTY_CONFIG[difficulty].attempts - guesses.length}
                    </p>
                  </div>
                )}
                {gameOver ? (
                  <GameOverStatus
                    won={won}
                    targetNumber={targetNumber}
                    onNewGame={startNewGame}
                    onReturnHome={returnToHome}
                  />
                ) : (
                  <GuessForm
                    value={currentGuess}
                    onChange={setCurrentGuess}
                    onSubmit={handleGuess}
                    error={error}
                  />
                )}
                <GuessList guesses={guesses} />
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    sdk.actions.ready()
      .then(() => sdk.actions.addMiniApp())
      .catch((e) => console.warn("SDK ready error:", e));
  }, []);

  if (!isConnected) {
    return <ConnectWallet />;
  }

  return <Game address={address} />;
}

export default App;