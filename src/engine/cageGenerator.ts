import { CageData, CellCoord, Difficulty } from '../types/game';
import { symbolToValue } from '../constants/symbols';
import { assignCageColors } from './graphColoring';

/**
 * Procedural flood-fill partitioning algorithm for Vildoku Killer Cage mode.
 * Enforces NO duplicate numbers within any cage and calculates decimal sums.
 */
export class CageGenerator {
  static generateCages(
    solution: string[][],
    gridSize: 9 | 16,
    difficulty: Difficulty
  ): CageData[] {
    const visited: boolean[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false)
    );

    const rawCages: Omit<CageData, 'colorIndex'>[] = [];
    let cageIdCounter = 1;

    // Difficulty params
    let minSize = 2;
    let maxSize = 4;
    let allowSingleCell = false;

    if (difficulty === 'EASY') {
      minSize = 1;
      maxSize = 3;
      allowSingleCell = true;
    } else if (difficulty === 'MEDIUM') {
      minSize = 2;
      maxSize = 4;
      allowSingleCell = false;
    } else { // HARD
      minSize = 3;
      maxSize = 5;
      allowSingleCell = false;
    }

    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    // Helper: shuffle array
    function shuffle<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    // Helper: get unvisited orthogonal neighbors
    function getValidNeighbors(
      r: number,
      c: number,
      existingValuesInCage: Set<string>
    ): CellCoord[] {
      const valid: CellCoord[] = [];
      for (const { dr, dc } of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && !visited[nr][nc]) {
          const val = solution[nr][nc];
          // CONSTRAINT: No duplicate numbers within the same cage
          if (!existingValuesInCage.has(val)) {
            valid.push({ row: nr, col: nc });
          }
        }
      }
      return valid;
    }

    // Iterate through all cells to form cages
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (visited[r][c]) continue;

        // Target size for this cage
        let targetSize: number;
        if (allowSingleCell && Math.random() < 0.25) {
          targetSize = 1;
        } else {
          targetSize = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        }

        const cageCells: CellCoord[] = [{ row: r, col: c }];
        const valuesInCage = new Set<string>([solution[r][c]]);
        visited[r][c] = true;

        // Expand cage using flood-fill frontier
        while (cageCells.length < targetSize) {
          // Collect all expandable neighbor candidates from current cage cells
          const candidateNeighbors: CellCoord[] = [];
          for (const cell of cageCells) {
            const nbs = getValidNeighbors(cell.row, cell.col, valuesInCage);
            for (const nb of nbs) {
              if (
                !candidateNeighbors.some((cn) => cn.row === nb.row && cn.col === nb.col)
              ) {
                candidateNeighbors.push(nb);
              }
            }
          }

          if (candidateNeighbors.length === 0) {
            break; // Cannot expand further without violating uniqueness or boundaries
          }

          // Pick random valid neighbor
          const next = candidateNeighbors[Math.floor(Math.random() * candidateNeighbors.length)];
          visited[next.row][next.col] = true;
          valuesInCage.add(solution[next.row][next.col]);
          cageCells.push(next);
        }

        // Determine top-left most cell for the target sum label
        cageCells.sort((a, b) => {
          if (a.row !== b.row) return a.row - b.row;
          return a.col - b.col;
        });

        // Compute decimal target sum
        const targetSum = cageCells.reduce(
          (acc, cell) => acc + symbolToValue(solution[cell.row][cell.col]),
          0
        );

        rawCages.push({
          id: cageIdCounter++,
          cells: cageCells,
          targetSum,
          labelCell: cageCells[0], // top-left
        });
      }
    }

    // Pass through graph coloring to assign 10 distinct non-adjacent colors
    return assignCageColors(rawCages, gridSize);
  }
}
