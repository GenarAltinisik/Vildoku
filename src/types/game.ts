export type GameMode = 
  | 'CAGE_9X9'        // 👑 Vildoku (Signature Cage Mode 9x9)
  | 'CAGE_HEX_16X16'   // 🌌 Vildoku Hex (Giant Cage 16x16)
  | 'CLASSIC_9X9'     // 🧩 Classic Sudoku 9x9
  | 'HEX_16X16';       // 🔠 Classic Hex Sudoku 16x16

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CellCoord {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: string;           // '' or '1'..'9' or 'A'..'G'
  solutionValue: string;   // the underlying correct solution
  isFixed: boolean;        // pre-filled initial clues (for classic modes or easy cage 1-cell hints)
  notes: string[];         // candidate notes
  cageId?: number;         // assigned cage ID (for cage modes)
  isError?: boolean;       // flash error visual
}

export interface CageData {
  id: number;
  cells: CellCoord[];
  targetSum: number;       // Decimal target sum (sum of underlying solution values)
  colorIndex: number;      // 0..9 index from CAGE_PALETTE
  labelCell: CellCoord;    // Top-left most cell in cage where sum badge is rendered
}

export interface HistoryStep {
  board: CellData[][];
  mistakes: number;
  selectedCell: CellCoord | null;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  gridSize: 9 | 16;
  blockRows: number;       // 3 for 9x9, 4 for 16x16
  blockCols: number;       // 3 for 9x9, 4 for 16x16
  board: CellData[][];
  solution: string[][];
  cages: CageData[];
  selectedCell: CellCoord | null;
  isNotesMode: boolean;
  mistakes: number;
  maxMistakes: number;
  timer: number;
  isPaused: boolean;
  isGameOver: boolean;
  isWon: boolean;
  hintsRemaining: number;
  history: HistoryStep[];
  historyIndex: number;
}

export interface ModeMetadata {
  id: GameMode;
  title: string;
  subtitle: string;
  isHero: boolean;
  gridSize: 9 | 16;
  hasCages: boolean;
  iconName: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number; // in seconds, 0 = none
  currentStreak: number;
  bestStreak: number;
}

export type AllStats = Record<`${GameMode}_${Difficulty}`, UserStats>;
