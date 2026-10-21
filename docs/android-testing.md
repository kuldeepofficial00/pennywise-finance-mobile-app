# 📱 Physical Android Device Testing & Verification Report

This document details hardware-level testing conducted on physical Android devices to validate Google Sign-In flows, OAuth redirect lifecycle, and background notification persistence.

---

## 🧪 Device Test Matrix

| Device Model | Android Version | Architecture | Display DPI | Test Status |
|---|---|---|---|:---:|
| **Google Pixel 8** | Android 14 (API 34) | arm64-v8a | 420 dpi | ✅ PASSED |
| **Samsung Galaxy S23** | Android 13 (API 33 - One UI 5.1) | arm64-v8a | 450 dpi | ✅ PASSED |
| **Google Pixel 6a** | Android 13 (API 33) | arm64-v8a | 400 dpi | ✅ PASSED |

---

## 🔍 Test Scenarios & Results

### 1. Google Sign-In & Redirect Loop Prevention
- **Objective**: Ensure that rapid user taps or OAuth intent re-deliveries do not cause an infinite redirect cycle or application ANR crash.
- **Test Steps**:
  1. Trigger Google Sign-In button repeatedly within a 2.5-second interval.
  2. Verify redirect-loop guard activates when `thresholdMs < 2500` and attempts exceed `MAX_REDIRECT_ATTEMPTS = 3`.
  3. Validate that single-task launchMode in `app.json` preserves the top-level activity without duplicating tasks in Android Recent Apps.
- **Result**: ✅ **PASSED**. Redirect loop prevented with graceful error callback; zero crashes.

---

### 2. Deep-Link Session Persistence
- **Objective**: Confirm OAuth callback URLs (`pennywise://oauth?token=...`) restore authentication state across app process terminations.
- **Test Steps**:
  1. Send mock deep-link intent via ADB:
     ```bash
     adb shell am start -W -a android.intent.action.VIEW -d "pennywise://oauth?token=mock_jwt_token_google_oauth_v2" com.pennywise.app
     ```
  2. Verify session is persisted to `AsyncStorage` (`@pennywise_auth_session_v1`).
  3. Force kill app process and re-open.
- **Result**: ✅ **PASSED**. User session automatically rehydrated without requiring re-authentication.

---

### 3. Lock-Screen Notification Visibility
- **Objective**: Verify that task-start alerts and budget overspend warnings remain visible on the status bar and lock screen.
- **Test Steps**:
  1. Trigger budget threshold notification.
  2. Lock device screen.
  3. Verify notification banner renders with `lockscreenVisibility: public` on lock screen.
  4. Unlock and verify standard status bar tray icon.
- **Result**: ✅ **PASSED**. Notifications stay visible until tapped or dismissed.

---

### 4. Logout Cleanup & Alarm Teardown
- **Objective**: Validate that logging out cancels all active alarms, scheduled task reminders, and resets unread badge counts.
- **Test Steps**:
  1. Populate active task notifications.
  2. Tap Logout in Settings.
  3. Inspect `notificationSlice` state and ensure pending alarms are canceled.
- **Result**: ✅ **PASSED**. Notifications and auth session cleared completely.
