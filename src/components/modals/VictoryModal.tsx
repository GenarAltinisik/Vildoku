import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Trophy, Sparkles, Clock, ArrowRight, Home } from 'lucide-react-native';
import { THEME } from '../../constants/colors';
import { Difficulty, GameMode } from '../../types/game';

interface VictoryModalProps {
  visible: boolean;
  mode: GameMode;
  difficulty: Difficulty;
  timeSeconds: number;
  isNewBest: boolean;
  onNextGame: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  mode,
  difficulty,
  timeSeconds,
  isNewBest,
  onNextGame,
  onHome,
}) => {
  useEffect(() => {
    if (visible && Platform.OS === 'web') {
      try {
        const confetti = require('canvas-confetti');
        if (confetti) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#a855f7', '#facc15', '#22c55e', '#f43f5e'],
          });
        }
      } catch {
        // ignore
      }
    }
  }, [visible]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeName = () => {
    switch (mode) {
      case 'CAGE_9X9':
        return 'Vildoku (Cage 9x9)';
      case 'CAGE_HEX_16X16':
        return 'Vildoku Hex (16x16)';
      case 'CLASSIC_9X9':
        return 'Classic Sudoku (9x9)';
      case 'HEX_16X16':
        return 'Classic Hex (16x16)';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Trophy Icon */}
          <View style={styles.trophyCircle}>
            <Trophy size={42} color="#000" />
          </View>

          <Text style={styles.title}>Congratulations, You Won! 🎉</Text>
          <Text style={styles.modeText}>{getModeName()}</Text>

          {/* Stats Box */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statLabelRow}>
                <Clock size={16} color={THEME.textMuted} />
                <Text style={styles.statLabel}>Completion Time:</Text>
              </View>
              <Text style={styles.statValue}>{formatTime(timeSeconds)}</Text>
            </View>

            {isNewBest && (
              <View style={styles.bestRecordBadge}>
                <Sparkles size={14} color={THEME.neonGold} />
                <Text style={styles.bestRecordText}>NEW BEST RECORD!</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.btnStack}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onNextGame} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>NEXT PUZZLE</Text>
              <ArrowRight size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={onHome} activeOpacity={0.8}>
              <Home size={18} color={THEME.text} />
              <Text style={styles.secondaryBtnText}>Choose Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.bgElevated,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.4)',
    padding: 24,
    alignItems: 'center',
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: THEME.neonGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: THEME.neonGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
    textAlign: 'center',
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.neonCyan,
    marginTop: 4,
    marginBottom: 20,
  },
  statsCard: {
    width: '100%',
    backgroundColor: THEME.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 22,
    alignItems: 'center',
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.text,
    fontVariant: ['tabular-nums'],
  },
  bestRecordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.4)',
  },
  bestRecordText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.neonGold,
    letterSpacing: 0.5,
  },
  btnStack: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: THEME.neonCyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  secondaryBtn: {
    backgroundColor: THEME.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 8,
  },
  secondaryBtnText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
