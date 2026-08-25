import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Crown, Sparkles, Grid, Layers, X, Check } from 'lucide-react-native';
import { THEME } from '../../constants/colors';
import { Difficulty, GameMode } from '../../types/game';

interface ModeSelectModalProps {
  visible: boolean;
  currentMode: GameMode;
  currentDifficulty: Difficulty;
  onClose: () => void;
  onSelect: (mode: GameMode, difficulty: Difficulty) => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({
  visible,
  currentMode,
  currentDifficulty,
  onClose,
  onSelect,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentMode);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>(currentDifficulty);

  const MODES: {
    id: GameMode;
    title: string;
    tag: string;
    desc: string;
    isHero: boolean;
    icon: any;
  }[] = [
    {
      id: 'CAGE_9X9',
      title: 'Vildoku',
      tag: '👑 SIGNATURE MODE',
      desc: 'No starting numbers! Fill dynamic colorful cages using logic and target sums.',
      isHero: true,
      icon: Crown,
    },
    {
      id: 'CAGE_HEX_16X16',
      title: 'Vildoku Hex',
      tag: '🌌 16x16 GIANT CAGE',
      desc: 'Massive 16x16 grid with 1-9 & A-G symbols. The ultimate cage challenge.',
      isHero: true,
      icon: Sparkles,
    },
    {
      id: 'CLASSIC_9X9',
      title: 'Classic Sudoku',
      tag: '🧩 9x9 STANDARD',
      desc: 'Traditional 9x9 Sudoku puzzle. Test your logical deduction.',
      isHero: false,
      icon: Grid,
    },
    {
      id: 'HEX_16X16',
      title: 'Classic Hex',
      tag: '🔠 16x16 STANDARD',
      desc: 'Expansive 16x16 Sudoku using numbers 1-9 and letters A-G.',
      isHero: false,
      icon: Layers,
    },
  ];

  const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
    { id: 'EASY', label: 'Easy', desc: 'Free hints & smaller cages' },
    { id: 'MEDIUM', label: 'Medium', desc: 'Balanced logic & strategy' },
    { id: 'HARD', label: 'Hard', desc: 'Large cages, pure mastery' },
  ];

  const handleStartGame = () => {
    onSelect(selectedMode, selectedDiff);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Select Game Mode</Text>
              <Text style={styles.headerSubtitle}>
                Choose your Sudoku & Cage challenge
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={22} color={THEME.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Mode Cards */}
            <Text style={styles.sectionTitle}>GAME MODES</Text>
            <View style={styles.modesContainer}>
              {MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                const IconComponent = mode.icon;

                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.modeCard,
                      mode.isHero && styles.modeCardHero,
                      isSelected && styles.modeCardSelected,
                    ]}
                    onPress={() => setSelectedMode(mode.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.modeCardHeader}>
                      <View style={styles.iconTitleRow}>
                        <View
                          style={[
                            styles.modeIconBox,
                            mode.isHero && styles.modeIconBoxHero,
                            isSelected && { backgroundColor: THEME.neonCyan },
                          ]}
                        >
                          <IconComponent
                            size={20}
                            color={
                              isSelected
                                ? '#000'
                                : mode.isHero
                                ? THEME.neonCyan
                                : THEME.text
                            }
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.modeTitle,
                              isSelected && { color: THEME.neonCyan },
                            ]}
                          >
                            {mode.title}
                          </Text>
                          <Text
                            style={[
                              styles.modeTag,
                              mode.isHero
                                ? { color: THEME.neonCyan }
                                : { color: THEME.textMuted },
                            ]}
                          >
                            {mode.tag}
                          </Text>
                        </View>
                      </View>

                      {isSelected && (
                        <View style={styles.checkBadge}>
                          <Check size={14} color="#000" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.modeDesc}>{mode.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Difficulty Cards */}
            <Text style={styles.sectionTitle}>DIFFICULTY</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDiff === diff.id;
                return (
                  <TouchableOpacity
                    key={diff.id}
                    style={[
                      styles.diffCard,
                      isSelected && styles.diffCardSelected,
                    ]}
                    onPress={() => setSelectedDiff(diff.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.diffLabel,
                        isSelected && { color: THEME.neonCyan },
                      ]}
                    >
                      {diff.label}
                    </Text>
                    <Text style={styles.diffDesc}>{diff.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startBtn}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <Sparkles size={20} color="#000" />
            <Text style={styles.startBtnText}>START GAME</Text>
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
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    backgroundColor: THEME.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 20,
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: THEME.surface,
  },
  scrollArea: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  modesContainer: {
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: THEME.border,
  },
  modeCardHero: {
    borderColor: 'rgba(0, 240, 255, 0.35)',
    backgroundColor: 'rgba(0, 240, 255, 0.04)',
  },
  modeCardSelected: {
    borderColor: THEME.neonCyan,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconBoxHero: {
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
  },
  modeTag: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeDesc: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 16,
  },
  diffRow: {
    gap: 8,
  },
  diffCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.border,
  },
  diffCardSelected: {
    borderColor: THEME.neonCyan,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  diffLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.text,
  },
  diffDesc: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  startBtn: {
    backgroundColor: THEME.neonCyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: THEME.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
