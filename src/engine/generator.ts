import { CageData, CellData, Difficulty, GameMode } from '../types/game';
import { SudokuSolver } from './solver';
import { CageGenerator } from './cageGenerator';

export interface GeneratedPuzzle {
  board: CellData[][];
  solution: string[][];
  cages: CageData[];
}

export class PuzzleGenerator {
  /**
   * Generates a complete game board, solution, and cages (if cage mode) for the requested mode and difficulty.
   */
  static createGame(mode: GameMode, difficulty: Difficulty): GeneratedPuzzle {
    const is16x16 = mode === 'HEX_16X16' || mode === 'CAGE_HEX_16X16';
    const isCage = mode === 'CAGE_9X9' || mode === 'CAGE_HEX_16X16';
    const gridSize = is16x16 ? 16 : 9;

    // 1. Generate full valid solution
    const solution = SudokuSolver.generateSolution(gridSize);

    // 2. Initialize blank cell data grid
    const board: CellData[][] = Array.from({ length: gridSize }, (_, r) =>
      Array.from({ length: gridSize }, (_, c) => ({
        row: r,
        col: c,
        value: '',
        solutionValue: solution[r][c],
        isFixed: false,
        notes: [],
        cageId: undefined,
        isError: false,
      }))
    );

    let cages: CageData[] = [];

    if (isCage) {
      // 3A. Vildoku Killer Cage Modes
      cages = CageGenerator.generateCages(solution, gridSize, difficulty);

      // Map cage IDs to individual cells
      cages.forEach((cage) => {
        cage.cells.forEach(({ row, col }) => {
          board[row][col].cageId = cage.id;
        });

        // Easy Mode Free Hints: 1-cell cages are prefilled
        if (difficulty === 'EASY' && cage.cells.length === 1) {
          const { row, col } = cage.cells[0];
          board[row][col].value = solution[row][col];
          board[row][col].isFixed = true;
        }
      });
    } else {
      // 3B. Classic Sudoku / Classic Hex Modes
      // Determine removal percentage based on difficulty
      let removalRatio = 0.45; // Easy: ~45% removed
      if (difficulty === 'MEDIUM') {
        removalRatio = 0.55; // Medium: ~55% removed
      } else if (difficulty === 'HARD') {
        removalRatio = 0.65; // Hard: ~65% removed
      }

      // Pre-fill board with solution, then dig holes
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          board[r][c].value = solution[r][c];
          board[r][c].isFixed = true;
        }
      }

      const totalCells = gridSize * gridSize;
      const targetToRemove = Math.floor(totalCells * removalRatio);

      // Randomly remove cells with symmetrical or semi-symmetrical balance
      const positions: { r: number; c: number }[] = [];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          positions.push({ r, c });
        }
      }

      // Shuffle positions
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      let removed = 0;
      for (const pos of positions) {
        if (removed >= targetToRemove) break;
        board[pos.r][pos.c].value = '';
        board[pos.r][pos.c].isFixed = false;
        removed++;
      }
    }

    return {
      board,
      solution,
      cages,
    };
  }
}
