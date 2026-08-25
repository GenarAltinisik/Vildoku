import { Platform } from 'react-native';

/**
 * Lightweight synthesized audio effects engine (Zero asset dependencies, instant response).
 */
export class AudioService {
  private static enabled = true;
  private static audioCtx: any = null;

  static setEnabled(val: boolean) {
    this.enabled = val;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  private static getAudioContext() {
    if (Platform.OS !== 'web') return null;
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play a pleasant synthesized frequency tone.
   */
  private static playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration = 0.08,
    gainLevel = 0.12
  ) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Sound on cell selection.
   */
  static playSelect() {
    this.playTone(480, 'sine', 0.04, 0.05);
  }

  /**
   * Sound when entering a valid number.
   */
  static playPlaceNumber() {
    this.playTone(650, 'sine', 0.07, 0.1);
  }

  /**
   * Sound when toggling pencil note.
   */
  static playNote() {
    this.playTone(850, 'triangle', 0.04, 0.06);
  }

  /**
   * Sound on mistake/error.
   */
  static playMistake() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  }

  /**
   * Sound on board completion fanfare!
   */
  static playVictory() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.25, 0.15);
      }, index * 120);
    });
  }
}
