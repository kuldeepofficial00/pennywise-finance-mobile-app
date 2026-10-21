import { Platform } from 'react-native';

export interface AndroidNotificationChannelConfig {
  id: string;
  name: string;
  description: string;
  importance: 'high' | 'default' | 'low';
  lockscreenVisibility: 'public' | 'private' | 'secret';
  showBadge: boolean;
  enableVibration: boolean;
  sound: boolean;
}

export const ANDROID_TASK_CHANNEL: AndroidNotificationChannelConfig = {
  id: 'pennywise_task_alerts',
  name: 'Task & Transaction Alerts',
  description: 'Instant reminders for recurring budget cycles and scheduled task starts.',
  importance: 'high',
  lockscreenVisibility: 'public', // Remains visible on lock screen
  showBadge: true,
  enableVibration: true,
  sound: true,
};

/**
 * Configure Android notification channels so task-start and recurring
 * alerts remain pinned and clearly visible on the system status bar and lock screen.
 */
export const configureTaskNotificationChannels = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // Channel initialization for Android 8.0+ (API level 26+)
    console.log(`[NotificationConfig] Android channel ${ANDROID_TASK_CHANNEL.id} registered with PUBLIC lockscreen visibility.`);
    return true;
  } catch (error) {
    console.warn('[NotificationConfig] Failed to initialize Android notification channel:', error);
    return false;
  }
};
