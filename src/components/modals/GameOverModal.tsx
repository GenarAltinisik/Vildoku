import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Skull, Video, RotateCcw, PlusCircle } from 'lucide-react-native';
import { THEME } from '../../constants/colors';

interface GameOverModalProps {
  visible: boolean;
  mistakes: number;
  onWatchAdExtraLife: () => void;
  onRestart: () => void;
  onNewGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  mistakes,
  onWatchAdExtraLife,
  onRestart,
  onNewGame,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Skull Icon */}
          <View style={styles.iconCircle}>
            <Skull size={38} color={THEME.neonRed} />
          </View>

          <Text style={styles.title}>Out of Lives!</Text>
          <Text style={styles.subtitle}>
            You made 3 mistakes. But you don't have to give up!
          </Text>

          {/* AdMob Rewarded Extra Life Option */}
          <TouchableOpacity
            style={styles.adRewardBtn}
            onPress={onWatchAdExtraLife}
            activeOpacity={0.8}
          >
            <Video size={20} color="#000" />
            <View>
              <Text style={styles.adRewardText}>WATCH AD & GET +1 LIFE</Text>
              <Text style={styles.adRewardSubtext}>Continue where you left off</Text>
            </View>
          </TouchableOpacity>

          {/* Alternative standard actions */}
          <View style={styles.btnStack}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onRestart} activeOpacity={0.8}>
              <RotateCcw size={18} color={THEME.text} />
              <Text style={styles.secondaryBtnText}>Restart Puzzle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={onNewGame} activeOpacity={0.8}>
              <PlusCircle size={18} color={THEME.text} />
              <Text style={styles.secondaryBtnText}>Choose New Puzzle</Text>
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
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    padding: 24,
    alignItems: 'center',
    shadowColor: THEME.neonRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.errorCellBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: THEME.neonRed,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 6,
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 18,
  },
  adRewardBtn: {
    backgroundColor: THEME.neonGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 12,
    width: '100%',
    marginBottom: 16,
    shadowColor: THEME.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  adRewardText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adRewardSubtext: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 11,
    fontWeight: '700',
  },
  btnStack: {
    width: '100%',
    gap: 10,
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
