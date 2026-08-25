import { SYMBOLS_9X9, SYMBOLS_16X16 } from '../constants/symbols';

/**
 * Fast backtracking solver and valid board generator for 9x9 and 16x16 Sudoku grids.
 */
export class SudokuSolver {
  /**
   * Generates a fully solved, valid Sudoku grid of size 9x9 or 16x16.
   */
  static generateSolution(gridSize: 9 | 16): string[][] {
    const symbols = gridSize === 9 ? [...SYMBOLS_9X9] : [...SYMBOLS_16X16];
    const blockRows = gridSize === 9 ? 3 : 4;
    const blockCols = gridSize === 9 ? 3 : 4;

    const board: string[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => '')
    );

    // Helper: check if a symbol is valid at (row, col)
    function isValid(r: number, c: number, symbol: string): boolean {
      // Row and Column check
      for (let i = 0; i < gridSize; i++) {
        if (board[r][i] === symbol || board[i][c] === symbol) return false;
      }

      // Block check
      const startR = Math.floor(r / blockRows) * blockRows;
      const startC = Math.floor(c / blockCols) * blockCols;
      for (let br = 0; br < blockRows; br++) {
        for (let bc = 0; bc < blockCols; bc++) {
          if (board[startR + br][startC + bc] === symbol) return false;
        }
      }

      return true;
    }

    // Shuffle helper for randomized backtracking
    function shuffle<T>(array: T[]): T[] {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Fill diagonal blocks first for massive speedup in generation
    for (let i = 0; i < gridSize; i += blockRows) {
      const blockSymbols = shuffle(symbols);
      let idx = 0;
      for (let br = 0; br < blockRows; br++) {
        for (let bc = 0; bc < blockCols; bc++) {
          board[i + br][i + bc] = blockSymbols[idx++];
        }
      }
    }

    // Solve remaining cells
    function solve(): boolean {
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board[r][c] === '') {
            const candidates = shuffle(symbols);
            for (const sym of candidates) {
              if (isValid(r, c, sym)) {
                board[r][c] = sym;
                if (solve()) return true;
                board[r][c] = '';
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    solve();
    return board;
  }

  /**
   * Validates if a move is valid within standard Sudoku rules (no duplicate in row/col/block).
   */
  static isValidMove(
    board: string[][],
    gridSize: 9 | 16,
    row: number,
    col: number,
    symbol: string
  ): boolean {
    const blockRows = gridSize === 9 ? 3 : 4;
    const blockCols = gridSize === 9 ? 3 : 4;

    for (let i = 0; i < gridSize; i++) {
      if (i !== col && board[row][i] === symbol) return false;
      if (i !== row && board[i][col] === symbol) return false;
    }

    const startR = Math.floor(row / blockRows) * blockRows;
    const startC = Math.floor(col / blockCols) * blockCols;
    for (let br = 0; br < blockRows; br++) {
      for (let bc = 0; bc < blockCols; bc++) {
        const r = startR + br;
        const c = startC + bc;
        if ((r !== row || c !== col) && board[r][c] === symbol) return false;
      }
    }

    return true;
  }
}
