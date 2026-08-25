import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllStats, Difficulty, GameMode, GameState, UserStats } from '../types/game';

const SAVE_KEY = '@vildoku_active_save_v1';
const STATS_KEY = '@vildoku_user_stats_v1';
const SETTINGS_KEY = '@vildoku_settings_v1';

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  highlightMatching: boolean;
  highlightRelated: boolean;
  autoRemoveNotes: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  highlightMatching: true,
  highlightRelated: true,
  autoRemoveNotes: true,
};

export class StorageService {
  /**
   * Saves current active game state to storage.
   */
  static async saveGame(state: GameState): Promise<void> {
    try {
      // Don't save if game is already over or won
      if (state.isGameOver || state.isWon) {
        await AsyncStorage.removeItem(SAVE_KEY);
        return;
      }
      const serialized = JSON.stringify({
        mode: state.mode,
        difficulty: state.difficulty,
        gridSize: state.gridSize,
        board: state.board,
        solution: state.solution,
        cages: state.cages,
        mistakes: state.mistakes,
        timer: state.timer,
        hintsRemaining: state.hintsRemaining,
      });
      await AsyncStorage.setItem(SAVE_KEY, serialized);
    } catch (e) {
      console.warn('Failed to save game state', e);
    }
  }

  /**
   * Loads saved game if one exists.
   */
  static async loadGame(): Promise<Partial<GameState> | null> {
    try {
      const data = await AsyncStorage.getItem(SAVE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load game state', e);
      return null;
    }
  }

  /**
   * Clears saved game on win / game over / new game.
   */
  static async clearSavedGame(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.warn('Failed to clear saved game', e);
    }
  }

  /**
   * Loads user stats for all modes and difficulties.
   */
  static async loadStats(): Promise<AllStats> {
    try {
      const data = await AsyncStorage.getItem(STATS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
    return {} as AllStats;
  }

  /**
   * Records a completed game in user statistics.
   */
  static async recordGameResult(
    mode: GameMode,
    difficulty: Difficulty,
    won: boolean,
    timeSeconds: number
  ): Promise<UserStats> {
    const allStats = await this.loadStats();
    const key = `${mode}_${difficulty}` as const;
    const current: UserStats = allStats[key] || {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: 0,
      currentStreak: 0,
      bestStreak: 0,
    };

    current.gamesPlayed += 1;
    if (won) {
      current.gamesWon += 1;
      current.currentStreak += 1;
      if (current.currentStreak > current.bestStreak) {
        current.bestStreak = current.currentStreak;
      }
      if (current.bestTime === 0 || timeSeconds < current.bestTime) {
        current.bestTime = timeSeconds;
      }
    } else {
      current.currentStreak = 0;
    }

    allStats[key] = current;
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(allStats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }

    return current;
  }

  /**
   * Loads user preferences and settings.
   */
  static async loadSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  /**
   * Saves user settings.
   */
  static async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }
}
