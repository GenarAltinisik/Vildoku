import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SYMBOLS_16X16, SYMBOLS_9X9 } from '../constants/symbols';
import { CellData } from '../types/game';
import { THEME } from '../constants/colors';

interface DynamicNumpadProps {
  gridSize: 9 | 16;
  board: CellData[][];
  onInputNumber: (symbol: string) => void;
  disabled?: boolean;
}

export const DynamicNumpad: React.FC<DynamicNumpadProps> = ({
  gridSize,
  board,
  onInputNumber,
  disabled = false,
}) => {
  const is16x16 = gridSize === 16;
  const symbols = is16x16 ? [...SYMBOLS_16X16] : [...SYMBOLS_9X9];

  // Calculate remaining counts for each symbol
  const remainingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    symbols.forEach((sym) => {
      counts[sym] = gridSize;
    });

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cellVal = board[r]?.[c]?.value;
        if (cellVal && counts[cellVal] !== undefined) {
          counts[cellVal] = Math.max(0, counts[cellVal] - 1);
        }
      }
    }

    return counts;
  }, [board, gridSize, symbols]);

  const renderButton = (sym: string) => {
    const remaining = remainingCounts[sym] ?? 0;
    const isCompleted = remaining <= 0;

    return (
      <Pressable
        key={sym}
        style={({ pressed }) => [
          styles.keyButton,
          is16x16 ? styles.keyButtonHex : styles.keyButtonClassic,
          isCompleted && styles.keyButtonCompleted,
          pressed && !isCompleted && !disabled && styles.keyButtonPressed,
        ]}
        onPress={() => onInputNumber(sym)}
        disabled={disabled || isCompleted}
      >
        <Text
          style={[
            styles.keyText,
            is16x16 ? styles.keyTextHex : styles.keyTextClassic,
            isCompleted && styles.keyTextCompleted,
          ]}
        >
          {sym}
        </Text>
        <Text
          style={[
            styles.remainingBadge,
            is16x16 ? styles.remainingBadgeHex : styles.remainingBadgeClassic,
            isCompleted && styles.remainingBadgeCompleted,
          ]}
        >
          {isCompleted ? '✓' : remaining}
        </Text>
      </Pressable>
    );
  };

  if (is16x16) {
    const row1 = symbols.slice(0, 8); // 1 to 8
    const row2 = symbols.slice(8, 16); // 9 to G

    return (
      <View style={styles.hexContainer}>
        <View style={styles.keyRowHex}>{row1.map(renderButton)}</View>
        <View style={styles.keyRowHex}>{row2.map(renderButton)}</View>
      </View>
    );
  }

  // 9x9: 2 centered rows (Row 1: 1-5, Row 2: 6-9)
  const row1 = symbols.slice(0, 5); // 1, 2, 3, 4, 5
  const row2 = symbols.slice(5, 9); // 6, 7, 8, 9

  return (
    <View style={styles.classicContainer}>
      <View style={styles.keyRowClassic}>{row1.map(renderButton)}</View>
      <View style={styles.keyRowClassic}>{row2.map(renderButton)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  classicContainer: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  hexContainer: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  keyRowClassic: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  keyRowHex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    width: '100%',
  },
  keyButton: {
    backgroundColor: THEME.bgElevated,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
    cursor: 'pointer' as any,
  },
  keyButtonPressed: {
    backgroundColor: THEME.surfaceHover,
    borderColor: THEME.neonCyan,
    transform: [{ scale: 0.94 }],
  },
  keyButtonClassic: {
    flex: 1,
    maxWidth: 58,
    height: 50,
  },
  keyButtonHex: {
    flex: 1, // Fluid responsive width so 8 buttons fit 100% of ANY phone screen
    maxWidth: 46,
    height: 40,
    borderRadius: 8,
    paddingVertical: 1,
  },
  keyButtonCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'transparent',
    opacity: 0.25,
    cursor: 'default' as any,
  },
  keyText: {
    fontWeight: '900',
    color: THEME.neonCyan,
    userSelect: 'none' as any,
  },
  keyTextClassic: {
    fontSize: 20,
  },
  keyTextHex: {
    fontSize: 14,
  },
  keyTextCompleted: {
    color: THEME.textDim,
  },
  remainingBadge: {
    fontWeight: '700',
    color: THEME.textMuted,
    marginTop: -2,
    userSelect: 'none' as any,
  },
  remainingBadgeClassic: {
    fontSize: 10,
  },
  remainingBadgeHex: {
    fontSize: 7.5,
  },
  remainingBadgeCompleted: {
    color: THEME.neonGreen,
  },
});
