import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Undo2, Redo2, Eraser, Edit3, Lightbulb, Video } from 'lucide-react-native';
import { THEME } from '../constants/colors';

interface ActionToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  isNotesMode: boolean;
  hintsRemaining: number;
  onUndo: () => void;
  onRedo: () => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onUseHint: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  canUndo,
  canRedo,
  isNotesMode,
  hintsRemaining,
  onUndo,
  onRedo,
  onErase,
  onToggleNotes,
  onUseHint,
}) => {
  return (
    <View style={styles.container}>
      {/* Undo */}
      <Pressable
        style={({ pressed }) => [
          styles.toolBtn,
          !canUndo && styles.toolBtnDisabled,
          pressed && canUndo && styles.toolBtnPressed,
        ]}
        onPress={onUndo}
        disabled={!canUndo}
      >
        <Undo2 size={18} color={canUndo ? THEME.text : THEME.textDim} />
        <Text style={[styles.toolLabel, !canUndo && styles.toolLabelDisabled]}>
          Undo
        </Text>
      </Pressable>

      {/* Redo */}
      <Pressable
        style={({ pressed }) => [
          styles.toolBtn,
          !canRedo && styles.toolBtnDisabled,
          pressed && canRedo && styles.toolBtnPressed,
        ]}
        onPress={onRedo}
        disabled={!canRedo}
      >
        <Redo2 size={18} color={canRedo ? THEME.text : THEME.textDim} />
        <Text style={[styles.toolLabel, !canRedo && styles.toolLabelDisabled]}>
          Redo
        </Text>
      </Pressable>

      {/* Eraser */}
      <Pressable
        style={({ pressed }) => [styles.toolBtn, pressed && styles.toolBtnPressed]}
        onPress={onErase}
      >
        <Eraser size={18} color={THEME.text} />
        <Text style={styles.toolLabel}>Erase</Text>
      </Pressable>

      {/* Notes / Pencil Toggle */}
      <Pressable
        style={({ pressed }) => [
          styles.toolBtn,
          isNotesMode && styles.toolBtnActive,
          pressed && styles.toolBtnPressed,
        ]}
        onPress={onToggleNotes}
      >
        <View style={styles.iconWithBadge}>
          <Edit3 size={18} color={isNotesMode ? THEME.selectedCellText : THEME.text} />
          <View
            style={[
              styles.notesBadge,
              isNotesMode ? styles.notesBadgeActive : styles.notesBadgeInactive,
            ]}
          >
            <Text
              style={[
                styles.notesBadgeText,
                isNotesMode ? styles.notesBadgeTextActive : styles.notesBadgeTextInactive,
              ]}
            >
              {isNotesMode ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.toolLabel, isNotesMode && { color: THEME.selectedCellText }]}
        >
          Notes
        </Text>
      </Pressable>

      {/* Hint */}
      <Pressable
        style={({ pressed }) => [styles.toolBtn, pressed && styles.toolBtnPressed]}
        onPress={onUseHint}
      >
        <View style={styles.iconWithBadge}>
          <Lightbulb size={18} color={THEME.neonGold} />
          {hintsRemaining > 0 ? (
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
            </View>
          ) : (
            <View style={styles.adHintBadge}>
              <Video size={10} color="#000" />
            </View>
          )}
        </View>
        <Text style={styles.toolLabel}>Hint</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 58,
    backgroundColor: THEME.bgElevated,
    borderWidth: 1,
    borderColor: THEME.border,
    cursor: 'pointer' as any,
  },
  toolBtnPressed: {
    backgroundColor: THEME.surfaceHover,
    transform: [{ scale: 0.95 }],
  },
  toolBtnActive: {
    backgroundColor: THEME.neonCyan,
    borderColor: THEME.neonCyan,
  },
  toolBtnDisabled: {
    opacity: 0.35,
    cursor: 'default' as any,
  },
  toolLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.textMuted,
    marginTop: 2,
    userSelect: 'none' as any,
  },
  toolLabelDisabled: {
    color: THEME.textDim,
  },
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  notesBadgeActive: {
    backgroundColor: '#000',
  },
  notesBadgeInactive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  notesBadgeText: {
    fontSize: 7,
    fontWeight: '900',
  },
  notesBadgeTextActive: {
    color: THEME.neonCyan,
  },
  notesBadgeTextInactive: {
    color: THEME.textDim,
  },
  hintBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: THEME.neonGold,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBadgeText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  adHintBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: THEME.neonGreen,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
