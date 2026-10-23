import { Platform } from 'react-native';
import { authService } from '../src/services/authService';
import { configureTaskNotificationChannels } from '../src/services/notificationConfig';
import { Strings } from '../src/constants/STRINGS';

describe('Web Application Platform Compatibility', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    (Platform as any).OS = originalPlatform;
  });

  it('safely completes Google sign-in workflow without Android native dependencies on web', async () => {
    (Platform as any).OS = 'web';
    expect(Platform.OS).toBe('web');

    const result = await authService.signInWithGoogle();
    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session?.email).toContain('@');
    expect(result.session?.provider).toBe('google');
  });

  it('gracefully skips native Android notification channels when running in web environment', async () => {
    (Platform as any).OS = 'web';

    const initialized = await configureTaskNotificationChannels();
    expect(initialized).toBe(true);
  });

  it('exposes privacy policy and terms of service strings on web platform', () => {
    expect(Strings.legal.privacyPolicy).toBe('Privacy Policy');
    expect(Strings.legal.privacyPolicyUrl).toBeDefined();
    expect(Strings.legal.termsOfService).toBe('Terms of Service');
    expect(Strings.legal.termsOfServiceUrl).toBeDefined();
  });

  it('allows safe logout and teardown on web without triggering Android alarms', async () => {
    (Platform as any).OS = 'web';
    await expect(authService.logout()).resolves.not.toThrow();
  });
});
