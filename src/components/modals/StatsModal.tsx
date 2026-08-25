import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Trophy, Flame, CheckCircle, Clock, X } from 'lucide-react-native';
import { THEME } from '../../constants/colors';
import { AllStats, Difficulty, GameMode } from '../../types/game';

interface StatsModalProps {
  visible: boolean;
  stats: AllStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ visible, stats, onClose }) => {
  const formatTime = (sec: number) => {
    if (!sec || sec === 0) return '--:--';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute aggregated stats
  let totalPlayed = 0;
  let totalWon = 0;
  let highestStreak = 0;

  Object.values(stats).forEach((s) => {
    totalPlayed += s.gamesPlayed;
    totalWon += s.gamesWon;
    if (s.bestStreak > highestStreak) highestStreak = s.bestStreak;
  });

  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;

  const MODES: { id: GameMode; title: string }[] = [
    { id: 'CAGE_9X9', title: '👑 Vildoku (Cage 9x9)' },
    { id: 'CAGE_HEX_16X16', title: '🌌 Vildoku Hex (16x16)' },
    { id: 'CLASSIC_9X9', title: '🧩 Classic 9x9' },
    { id: 'HEX_16X16', title: '🔠 Classic Hex 16x16' },
  ];

  const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Trophy size={22} color={THEME.neonGold} />
              <Text style={styles.title}>Statistics</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={THEME.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Top Stat Cards */}
            <View style={styles.topStatsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{totalPlayed}</Text>
                <Text style={styles.statLabel}>Played</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: THEME.neonGreen }]}>{winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>

              <View style={styles.statBox}>
                <View style={styles.flameRow}>
                  <Flame size={16} color={THEME.neonGold} />
                  <Text style={[styles.statNum, { color: THEME.neonGold }]}>
                    {highestStreak}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>

            {/* Best Times by Mode */}
            <Text style={styles.sectionHeader}>BEST TIMES</Text>
            <View style={styles.modeStatsContainer}>
              {MODES.map((mode) => (
                <View key={mode.id} style={styles.modeCard}>
                  <Text style={styles.modeCardTitle}>{mode.title}</Text>
                  <View style={styles.diffTimesRow}>
                    {DIFFICULTIES.map((diff) => {
                      const key = `${mode.id}_${diff}` as const;
                      const best = stats[key]?.bestTime || 0;
                      const label =
                        diff === 'EASY' ? 'Easy' : diff === 'MEDIUM' ? 'Medium' : 'Hard';

                      return (
                        <View key={diff} style={styles.diffTimeItem}>
                          <Text style={styles.diffTimeLabel}>{label}</Text>
                          <Text style={styles.diffTimeValue}>{formatTime(best)}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeFullBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeFullBtnText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: THEME.bgElevated,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.text,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: THEME.surface,
  },
  topStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.surface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.text,
  },
  flameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  modeStatsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: THEME.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  modeCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 8,
  },
  diffTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.bgElevated,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  diffTimeItem: {
    alignItems: 'center',
  },
  diffTimeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
  },
  diffTimeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.neonCyan,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  closeFullBtn: {
    backgroundColor: THEME.surface,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  closeFullBtnText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
