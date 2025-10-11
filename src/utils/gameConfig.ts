import { Difficulty, GameConfig } from '../types/game';

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  easy: {
    attempts: 12,
    winPoints: 10,
    losePoints: -5
  },
  medium: {
    attempts: 9,
    winPoints: 15,
    losePoints: -10
  },
  hard: {
    attempts: 6,
    winPoints: 20,
    losePoints: -15
  }
};