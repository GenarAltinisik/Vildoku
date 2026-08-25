import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CageData, CellData } from '../types/game';
import { CAGE_PALETTE, THEME } from '../constants/colors';
import { SYMBOLS_16X16, SYMBOLS_9X9 } from '../constants/symbols';

interface CellViewProps {
  cell: CellData;
  gridSize: 9 | 16;
  cellSize: number;
  isSelected: boolean;
  isSameNumber: boolean;
  isRelated: boolean;
  isCrossHatchRow: boolean; // Horizontal laser elimination line
  isCrossHatchCol: boolean; // Vertical laser elimination line
  cage?: CageData;
  isCageLabel: boolean;
  hasCageTop: boolean;
  hasCageBottom: boolean;
  hasCageLeft: boolean;
  hasCageRight: boolean;
  isBlockRight: boolean;
  isBlockBottom: boolean;
  onSelect: (row: number, col: number) => void;
}

const arePropsEqual = (prev: CellViewProps, next: CellViewProps): boolean => {
  return (
    prev.cell.value === next.cell.value &&
    prev.cell.isError === next.cell.isError &&
    prev.isSelected === next.isSelected &&
    prev.isSameNumber === next.isSameNumber &&
    prev.isRelated === next.isRelated &&
    prev.isCrossHatchRow === next.isCrossHatchRow &&
    prev.isCrossHatchCol === next.isCrossHatchCol &&
    prev.hasCageTop === next.hasCageTop &&
    prev.hasCageBottom === next.hasCageBottom &&
    prev.hasCageLeft === next.hasCageLeft &&
    prev.hasCageRight === next.hasCageRight &&
    prev.isCageLabel === next.isCageLabel &&
    prev.cellSize === next.cellSize &&
    prev.cell.isFixed === next.cell.isFixed &&
    prev.cell.notes.length === next.cell.notes.length &&
    (prev.cell.notes.length === 0 ||
      prev.cell.notes.every((n, i) => n === next.cell.notes[i]))
  );
};

export const CellView: React.FC<CellViewProps> = React.memo(
  ({
    cell,
    gridSize,
    cellSize,
    isSelected,
    isSameNumber,
    isRelated,
    isCrossHatchRow,
    isCrossHatchCol,
    cage,
    isCageLabel,
    hasCageTop,
    hasCageBottom,
    hasCageLeft,
    hasCageRight,
    isBlockRight,
    isBlockBottom,
    onSelect,
  }) => {
    const is16x16 = gridSize === 16;
    const isLastCol = cell.col === gridSize - 1;
    const isLastRow = cell.row === gridSize - 1;
    const cageColor = cage ? CAGE_PALETTE[cage.colorIndex % CAGE_PALETTE.length] : null;
    const isCrossHatched = isCrossHatchRow || isCrossHatchCol;

    // Background color logic
    let backgroundColor = THEME.surface;
    if (cageColor) {
      backgroundColor = cageColor.fill;
    }
    if (isRelated) {
      backgroundColor = THEME.relatedRowCol;
    }
    if (isCrossHatched && !isSameNumber && !isSelected) {
      backgroundColor = THEME.crossHatchTrack;
    }
    if (isSameNumber && !isSelected) {
      backgroundColor = THEME.sameNumberCell;
    }
    if (isSelected) {
      backgroundColor = THEME.selectedCell;
    }
    if (cell.isError) {
      backgroundColor = THEME.errorCellBg;
    }

    // Text color logic
    let textColor = cell.isFixed ? THEME.fixedNumber : THEME.userInputNumber;
    if (isSelected) {
      textColor = THEME.selectedCellText;
    } else if (isSameNumber) {
      textColor = THEME.sameNumberText;
    } else if (cell.isError) {
      textColor = THEME.neonRed;
    }

    // Grid divider borders:
    const borderRightWidth = isLastCol ? 0 : isBlockRight ? (is16x16 ? 1.5 : 2) : 0.5;
    const borderBottomWidth = isLastRow ? 0 : isBlockBottom ? (is16x16 ? 1.5 : 2) : 0.5;
    const borderRightColor = isBlockRight ? THEME.borderThick : THEME.border;
    const borderBottomColor = isBlockBottom ? THEME.borderThick : THEME.border;

    // Clean cage border insets
    const insetTop = 1.5;
    const insetLeft = 1.5;
    const insetRight = isBlockRight ? 3 : 1.5;
    const insetBottom = isBlockBottom ? 3 : 1.5;

    // Font sizing based on 9x9 or 16x16
    const fontSize = is16x16 ? Math.max(10, cellSize * 0.52) : Math.max(16, cellSize * 0.58);
    const sumFontSize = is16x16 ? 7 : 9;

    return (
      <Pressable
        style={[
          styles.cellContainer,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor,
            borderRightWidth,
            borderBottomWidth,
            borderRightColor,
            borderBottomColor,
          },
        ]}
        onPress={() => onSelect(cell.row, cell.col)}
      >
        {/* Horizontal Laser Beam */}
        {isCrossHatchRow && !isSameNumber && !isSelected && (
          <View style={styles.horizontalLaser} pointerEvents="none" />
        )}

        {/* Vertical Laser Beam */}
        {isCrossHatchCol && !isSameNumber && !isSelected && (
          <View style={styles.verticalLaser} pointerEvents="none" />
        )}

        {/* Cage Full Enclosure Dashed Borders */}
        {cageColor && (
          <View
            style={[
              styles.cageBorderOverlay,
              {
                top: insetTop,
                left: insetLeft,
                right: insetRight,
                bottom: insetBottom,
                borderTopWidth: hasCageTop ? 1.5 : 0,
                borderBottomWidth: hasCageBottom ? 1.5 : 0,
                borderLeftWidth: hasCageLeft ? 1.5 : 0,
                borderRightWidth: hasCageRight ? 1.5 : 0,
                borderTopColor: cageColor.border,
                borderBottomColor: cageColor.border,
                borderLeftColor: cageColor.border,
                borderRightColor: cageColor.border,
                borderStyle: 'dashed',
              },
            ]}
            pointerEvents="none"
          />
        )}

        {/* High-Contrast Luminous Gold Spotlight Ring for Same Number Matching */}
        {isSameNumber && !isSelected && (
          <View
            style={[
              styles.sameNumberHighlightOverlay,
              {
                top: 2,
                left: 2,
                right: isBlockRight ? 3 : 2,
                bottom: isBlockBottom ? 3 : 2,
                borderColor: THEME.sameNumberBorder,
              },
            ]}
            pointerEvents="none"
          />
        )}

        {/* Cage Target Sum Badge (top-left) */}
        {isCageLabel && cage && (
          <View style={styles.sumBadgeContainer} pointerEvents="none">
            <Text
              style={[
                styles.sumBadgeText,
                { fontSize: sumFontSize, color: cageColor?.badge || THEME.text },
              ]}
            >
              {cage.targetSum}
            </Text>
          </View>
        )}

        {/* Cell Value or Pencil Notes */}
        {cell.value ? (
          <Text
            style={[
              styles.cellValueText,
              {
                fontSize,
                color: textColor,
                fontWeight: isSelected ? '900' : isSameNumber ? '900' : cell.isFixed ? '800' : '700',
                transform: isSameNumber && !isSelected ? [{ scale: 1.22 }] : [],
                textShadowColor: isSameNumber && !isSelected ? 'rgba(250, 204, 21, 0.8)' : undefined,
                textShadowOffset: isSameNumber && !isSelected ? { width: 0, height: 0 } : undefined,
                textShadowRadius: isSameNumber && !isSelected ? 6 : undefined,
              },
            ]}
          >
            {cell.value}
          </Text>
        ) : cell.notes && cell.notes.length > 0 ? (
          <View style={styles.notesGrid} pointerEvents="none">
            {(is16x16 ? SYMBOLS_16X16 : SYMBOLS_9X9).map((sym) => {
              const hasNote = cell.notes.includes(sym);
              return (
                <View
                  key={sym}
                  style={[
                    styles.noteCell,
                    {
                      width: cellSize / (is16x16 ? 4 : 3),
                      height: cellSize / (is16x16 ? 4 : 3),
                    },
                  ]}
                >
                  {hasNote && (
                    <Text
                      style={[
                        styles.noteText,
                        {
                          fontSize: is16x16 ? 6 : 8,
                          color: isSelected ? THEME.selectedCellText : THEME.pencilNoteText,
                        },
                      ]}
                    >
                      {sym}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : null}
      </Pressable>
    );
  },
  arePropsEqual
);

const styles = StyleSheet.create({
  cellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer' as any,
  },
  horizontalLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1.5,
    marginTop: -0.75,
    backgroundColor: '#facc15',
    opacity: 0.65,
    zIndex: 1,
  },
  verticalLaser: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1.5,
    marginLeft: -0.75,
    backgroundColor: '#facc15',
    opacity: 0.65,
    zIndex: 1,
  },
  cageBorderOverlay: {
    position: 'absolute',
  },
  sameNumberHighlightOverlay: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 0,
    backgroundColor: THEME.sameNumberCell,
    zIndex: 2,
  },
  sumBadgeContainer: {
    position: 'absolute',
    top: 2,
    left: 3,
    zIndex: 2,
  },
  sumBadgeText: {
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  cellValueText: {
    textAlign: 'center',
    zIndex: 3,
    userSelect: 'none' as any,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    zIndex: 2,
    userSelect: 'none' as any,
  },
  noteCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    fontWeight: '700',
  },
});
