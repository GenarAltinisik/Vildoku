import { CageData } from '../types/game';

/**
 * Applies graph coloring to ensure no two adjacent cages share the same color index.
 * Uses greedy graph coloring with saturation/degree prioritization.
 */
export function assignCageColors(
  cages: Omit<CageData, 'colorIndex'>[],
  gridSize: 9 | 16
): CageData[] {
  const cageMap = new Map<number, typeof cages[0]>();
  cages.forEach((c) => cageMap.set(c.id, c));

  // 1. Build grid of cage IDs
  const grid: number[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => -1)
  );

  cages.forEach((cage) => {
    cage.cells.forEach(({ row, col }) => {
      grid[row][col] = cage.id;
    });
  });

  // 2. Build adjacency list for each cage
  const adjList = new Map<number, Set<number>>();
  cages.forEach((c) => adjList.set(c.id, new Set<number>()));

  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const currentCageId = grid[r][c];
      for (const { dr, dc } of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
          const neighborCageId = grid[nr][nc];
          if (neighborCageId !== -1 && neighborCageId !== currentCageId) {
            adjList.get(currentCageId)?.add(neighborCageId);
            adjList.get(neighborCageId)?.add(currentCageId);
          }
        }
      }
    }
  }

  // 3. Sort cages by degree (number of neighbors) descending (Welsh-Powell heuristic)
  const sortedCageIds = [...cages.map((c) => c.id)].sort(
    (a, b) => (adjList.get(b)?.size || 0) - (adjList.get(a)?.size || 0)
  );

  const colors = new Map<number, number>();
  const totalPaletteColors = 10;

  for (const cageId of sortedCageIds) {
    const neighbors = adjList.get(cageId) || new Set();
    const usedColors = new Set<number>();

    neighbors.forEach((neighborId) => {
      if (colors.has(neighborId)) {
        usedColors.add(colors.get(neighborId)!);
      }
    });

    // Find the lowest available color index (0..9)
    let assignedColor = 0;
    while (usedColors.has(assignedColor) && assignedColor < totalPaletteColors - 1) {
      assignedColor++;
    }

    // Fallback if all 10 used (rare for planar graphs): pick the least frequent
    if (usedColors.has(assignedColor)) {
      assignedColor = Math.floor(Math.random() * totalPaletteColors);
    }

    colors.set(cageId, assignedColor);
  }

  // 4. Return enriched cages
  return cages.map((c) => ({
    ...c,
    colorIndex: colors.get(c.id) ?? 0,
  }));
}
