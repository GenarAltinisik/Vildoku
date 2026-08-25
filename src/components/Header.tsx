import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Play, Heart, Trophy, Sparkles, Grid } from 'lucide-react-native';
import { THEME } from '../constants/colors';
import { Difficulty, GameMode } from '../types/game';

interface HeaderProps {
  mode: GameMode;
  difficulty: Difficulty;
  mistakes: number;
  maxMistakes: number;
  timer: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenModeSelect: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  difficulty,
  mistakes,
  maxMistakes,
  timer,
  isPaused,
  onTogglePause,
  onOpenModeSelect,
  onOpenStats,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'CAGE_9X9':
        return { label: 'VILDOKU', badge: '👑 SIGNATURE' };
      case 'CAGE_HEX_16X16':
        return { label: 'VILDOKU HEX', badge: '🌌 16x16 GIANT CAGE' };
      case 'CLASSIC_9X9':
        return { label: 'CLASSIC 9x9', badge: '🧩 STANDARD' };
      case 'HEX_16X16':
        return { label: 'CLASSIC HEX', badge: '🔠 16x16' };
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'EASY':
        return 'Easy';
      case 'MEDIUM':
        return 'Medium';
      case 'HARD':
        return 'Hard';
    }
  };

  const modeInfo = getModeTitle();

  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.modeSelectorBtn}
          onPress={onOpenModeSelect}
          activeOpacity={0.8}
        >
          <View style={styles.logoRow}>
            <Sparkles size={18} color={THEME.neonCyan} />
            <Text style={styles.logoText}>{modeInfo.label}</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{modeInfo.badge}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenStats}
            activeOpacity={0.7}
          >
            <Trophy size={20} color={THEME.neonGold} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenModeSelect}
            activeOpacity={0.7}
          >
            <Grid size={20} color={THEME.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Status Bar (Difficulty, Mistakes/Lives, Timer) */}
      <View style={styles.statusBar}>
        <View style={styles.difficultyTag}>
          <Text style={styles.difficultyText}>{getDifficultyLabel()}</Text>
        </View>

        {/* Lives / Mistakes */}
        <View style={styles.mistakesContainer}>
          <Text style={styles.statusLabel}>Mistakes:</Text>
          <View style={styles.heartsRow}>
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <Heart
                key={i}
                size={16}
                color={i < mistakes ? THEME.neonRed : THEME.neonCyan}
                fill={i < mistakes ? THEME.errorCellBg : THEME.neonCyan}
                style={styles.heartIcon}
              />
            ))}
          </View>
        </View>

        {/* Timer & Pause Button */}
        <TouchableOpacity
          style={styles.timerBtn}
          onPress={onTogglePause}
          activeOpacity={0.8}
        >
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          {isPaused ? (
            <Play size={16} color={THEME.neonGreen} />
          ) : (
            <Pause size={16} color={THEME.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: THEME.bg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.bgElevated,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: THEME.text,
  },
  modeBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.neonCyan,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  difficultyTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textMuted,
    textTransform: 'uppercase',
  },
  mistakesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  heartIcon: {
    marginHorizontal: 1,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
    fontVariant: ['tabular-nums'],
  },
});
