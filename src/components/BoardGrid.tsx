import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { CageData, CellCoord, CellData } from '../types/game';
import { CellView } from './CellView';
import { THEME } from '../constants/colors';

interface BoardGridProps {
  board: CellData[][];
  cages: CageData[];
  gridSize: 9 | 16;
  blockRows: number;
  blockCols: number;
  selectedCell: CellCoord | null;
  onSelectCell: (row: number, col: number) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  board,
  cages,
  gridSize,
  blockRows,
  blockCols,
  selectedCell,
  onSelectCell,
}) => {
  const { width, height } = useWindowDimensions();

  // Responsive square 1:1 board sizing
  const boardSize = useMemo(() => {
    const horizontalMargin = 20;
    const maxAvailableWidth = Math.min(width - horizontalMargin, 450);
    const heightFactor = gridSize === 16 ? 0.44 : 0.46;
    const maxAvailableHeight = Math.floor(height * heightFactor);
    return Math.floor(Math.min(maxAvailableWidth, maxAvailableHeight));
  }, [width, height, gridSize]);

  const cellSize = Math.floor(boardSize / gridSize);
  const totalActualBoardSize = cellSize * gridSize;

  // Cage lookup map by ID
  const cageMap = useMemo(() => {
    const map = new Map<number, CageData>();
    cages.forEach((c) => map.set(c.id, c));
    return map;
  }, [cages]);

  // Selected cell value for matching highlights
  const selectedValue = useMemo(() => {
    if (!selectedCell) return '';
    return board[selectedCell.row]?.[selectedCell.col]?.value || '';
  }, [selectedCell, board]);

  // Compute all rows and columns occupied by matching numbers (Cross-Hatching Elimination lines)
  const { matchingRows, matchingCols } = useMemo(() => {
    const rows = new Set<number>();
    const cols = new Set<number>();
    if (!selectedValue) return { matchingRows: rows, matchingCols: cols };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (board[r]?.[c]?.value === selectedValue) {
          rows.add(r);
          cols.add(c);
        }
      }
    }
    return { matchingRows: rows, matchingCols: cols };
  }, [board, selectedValue, gridSize]);

  // Frame offset padding (creates breathing room between outer solid border and cage dashed borders)
  const framePadding = cages.length > 0 ? 3 : 0;
  const outerBorderWidth = 2;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.boardFrame,
          {
            padding: framePadding,
            width: totalActualBoardSize + framePadding * 2 + outerBorderWidth * 2,
            height: totalActualBoardSize + framePadding * 2 + outerBorderWidth * 2,
          },
        ]}
      >
        <View style={styles.gridContainer}>
          {board.map((rowCells, r) => (
            <View key={`row-${r}`} style={styles.row}>
              {rowCells.map((cell, c) => {
                const cage = cell.cageId ? cageMap.get(cell.cageId) : undefined;
                const isSelected = !!selectedCell && selectedCell.row === r && selectedCell.col === c;
                const isSameNumber = !!selectedValue && cell.value === selectedValue;

                // Related row, col, or block to the currently selected cell
                const isSameRow = !!selectedCell && selectedCell.row === r;
                const isSameCol = !!selectedCell && selectedCell.col === c;
                const isSameBlock =
                  !!selectedCell &&
                  Math.floor(selectedCell.row / blockRows) === Math.floor(r / blockRows) &&
                  Math.floor(selectedCell.col / blockCols) === Math.floor(c / blockCols);
                const isRelated = isSameRow || isSameCol || isSameBlock;

                // Cross-Hatching: Is this row or column occupied by ANY matching number?
                const isCrossHatchRow = matchingRows.has(r);
                const isCrossHatchCol = matchingCols.has(c);

                // Is this the label cell for the cage?
                const isCageLabel = !!cage && cage.labelCell.row === r && cage.labelCell.col === c;

                // Cage boundary checks (Full 4-sided enclosure for complete cage visualization)
                const hasCageTop = !!cage && (r === 0 || board[r - 1][c].cageId !== cell.cageId);
                const hasCageBottom =
                  !!cage && (r === gridSize - 1 || board[r + 1][c].cageId !== cell.cageId);
                const hasCageLeft = !!cage && (c === 0 || board[r][c - 1].cageId !== cell.cageId);
                const hasCageRight =
                  !!cage && (c === gridSize - 1 || board[r][c + 1].cageId !== cell.cageId);

                // Block thick divider checks
                const isBlockRight = (c + 1) % blockCols === 0 && c < gridSize - 1;
                const isBlockBottom = (r + 1) % blockRows === 0 && r < gridSize - 1;

                return (
                  <CellView
                    key={`cell-${r}-${c}`}
                    cell={cell}
                    gridSize={gridSize}
                    cellSize={cellSize}
                    isSelected={isSelected}
                    isSameNumber={isSameNumber}
                    isRelated={isRelated}
                    isCrossHatchRow={isCrossHatchRow}
                    isCrossHatchCol={isCrossHatchCol}
                    cage={cage}
                    isCageLabel={isCageLabel}
                    hasCageTop={hasCageTop}
                    hasCageBottom={hasCageBottom}
                    hasCageLeft={hasCageLeft}
                    hasCageRight={hasCageRight}
                    isBlockRight={isBlockRight}
                    isBlockBottom={isBlockBottom}
                    onSelect={onSelectCell}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardFrame: {
    backgroundColor: THEME.surface,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.borderThick,
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  gridContainer: {
    backgroundColor: THEME.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
