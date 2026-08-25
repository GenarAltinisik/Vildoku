import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Play, RotateCcw, PlusCircle, Volume2, VolumeX, Vibrate } from 'lucide-react-native';
import { THEME } from '../../constants/colors';

interface PauseModalProps {
  visible: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onNewGame: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  soundEnabled,
  hapticsEnabled,
  onResume,
  onRestart,
  onNewGame,
  onToggleSound,
  onToggleHaptics,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Game Paused</Text>
          <Text style={styles.subtitle}>Take a breather and resume when ready</Text>

          {/* Action Buttons */}
          <View style={styles.btnStack}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onResume} activeOpacity={0.8}>
              <Play size={20} color="#000" />
              <Text style={styles.primaryBtnText}>RESUME</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={onRestart} activeOpacity={0.8}>
              <RotateCcw size={18} color={THEME.text} />
              <Text style={styles.secondaryBtnText}>Restart Puzzle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={onNewGame} activeOpacity={0.8}>
              <PlusCircle size={18} color={THEME.text} />
              <Text style={styles.secondaryBtnText}>Select Mode / New Game</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Settings (Audio & Haptics) */}
          <View style={styles.settingsRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, soundEnabled && styles.toggleBtnActive]}
              onPress={onToggleSound}
              activeOpacity={0.7}
            >
              {soundEnabled ? (
                <Volume2 size={18} color={THEME.neonCyan} />
              ) : (
                <VolumeX size={18} color={THEME.textDim} />
              )}
              <Text style={[styles.toggleText, soundEnabled && { color: THEME.neonCyan }]}>
                Sound {soundEnabled ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, hapticsEnabled && styles.toggleBtnActive]}
              onPress={onToggleHaptics}
              activeOpacity={0.7}
            >
              <Vibrate size={18} color={hapticsEnabled ? THEME.neonCyan : THEME.textDim} />
              <Text style={[styles.toggleText, hapticsEnabled && { color: THEME.neonCyan }]}>
                Haptics {hapticsEnabled ? 'ON' : 'OFF'}
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 24,
    alignItems: 'center',
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  btnStack: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: THEME.neonCyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
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
  settingsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.surface,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 6,
  },
  toggleBtnActive: {
    borderColor: 'rgba(0, 240, 255, 0.4)',
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textMuted,
  },
});
