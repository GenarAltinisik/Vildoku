import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticsService {
  private static enabled = true;

  static setEnabled(val: boolean) {
    this.enabled = val;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Light tactile tap when selecting a cell or pressing a button.
   */
  static selection() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
  }

  /**
   * Crisp impact when successfully placing a number.
   */
  static numberPlaced() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  }

  /**
   * Medium impact when erasing or toggling notes.
   */
  static toolAction() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
  }

  /**
   * Distinct error vibration when entering an incorrect number.
   */
  static mistake() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // ignore
    }
  }

  /**
   * Celebratory vibration pattern when completing the board!
   */
  static victory() {
    if (!this.enabled || Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 250);
    } catch {
      // ignore
    }
  }
}
