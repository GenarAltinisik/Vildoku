import { Alert } from 'react-native';

/**
 * Google AdMob monetization service.
 * Configured with Google's official Test Ad Unit IDs for safe development & testing.
 */
export const ADMOB_TEST_IDS = {
  ANDROID_BANNER: 'ca-app-pub-3940256099942544/6300978111',
  ANDROID_INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  ANDROID_REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  IOS_BANNER: 'ca-app-pub-3940256099942544/2934735716',
  IOS_INTERSTITIAL: 'ca-app-pub-3940256099942544/4411468910',
  IOS_REWARDED: 'ca-app-pub-3940256099942544/1712485313',
};

export class AdMobService {
  private static isAdsRemoved = false;
  private static gamesPlayedCount = 0;

  static setAdsRemoved(val: boolean) {
    this.isAdsRemoved = val;
  }

  static areAdsRemoved(): boolean {
    return this.isAdsRemoved;
  }

  /**
   * Tracks completed games and triggers an Interstitial ad every 2 completed games.
   */
  static onGameFinished(callback?: () => void) {
    if (this.isAdsRemoved) {
      callback?.();
      return;
    }

    this.gamesPlayedCount += 1;
    // Show interstitial every 2 games
    if (this.gamesPlayedCount % 2 === 0) {
      this.showInterstitialAd(callback);
    } else {
      callback?.();
    }
  }

  /**
   * Shows a full-screen Interstitial ad between games.
   */
  static showInterstitialAd(onDismiss?: () => void) {
    if (this.isAdsRemoved) {
      onDismiss?.();
      return;
    }

    // In Expo Go / Web / Dev mode, we simulate the ad seamlessly
    console.log('[AdMob] Displaying Interstitial Ad (Test Unit)...');
    onDismiss?.();
  }

  /**
   * Shows a Rewarded Video Ad for Extra Life (3 mistakes continue) or Extra Hint.
   */
  static showRewardedAd(
    rewardTitle: string,
    onRewardEarned: () => void,
    onClosed?: () => void
  ) {
    Alert.alert(
      '🎬 Rewarded Video (AdMob Test)',
      `Watch a short video ad to earn: "${rewardTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => onClosed?.(),
        },
        {
          text: 'Watch & Earn',
          onPress: () => {
            console.log(`[AdMob] Rewarded Ad Completed for: ${rewardTitle}`);
            onRewardEarned();
          },
        },
      ]
    );
  }
}
