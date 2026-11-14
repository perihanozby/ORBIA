# Android QA

NOT TESTED. Physical-device installation and launch require explicit user authorization after a reviewable APK exists. No device commands to enumerate, install or launch were executed. No emulator or Android Studio created.

Pending: install, first launch/onboarding, navigation/back, CRUD persistence across restart, reminders and permission denial, focus background/restart recovery, date changes, theme/language settings, import/export rollback, large text/TalkBack, keyboard/safe area, responsive screenshots and physical-device performance.

Record device model, Android/API version, build revision, scenario, expected/actual behavior and screenshots when authorized. Build success does not establish device QA.

Native artifact update: a real ARM64 debug APK is built and structurally verified. Installation, launch, TalkBack, screenshots, real SQLite recovery and reminder delivery remain NOT TESTED. No device operations performed.

## Authorized installation attempt — 2026-11-14

User explicitly approved installation and launch of the existing debug APK, preserving application data. ADB detected one authorized device: Redmi Note 9S (curtana). Ran adb install -r for com.orbia.productivity; failed with INSTALL_FAILED_INSUFFICIENT_STORAGE. Read-only df check reported /data 105G total, 104G used, 659M available, 100% usage. pm path returned no installed ORBIA package. Launch was not attempted because installation failed. No app uninstalled, no storage cleaned, and no user data cleared. User must free storage before retry; existing installation/launch authorization persists.

## Authorized installation retry — 2026-11-14

Redmi Note 9S connected and authorized. Read-only storage check showed 839M available on /data (reported 100% usage). Existing debug APK installed with adb install -r: Success (exit 0); no uninstall or data clear. am start -W com.orbia.productivity/com.orbia.MainActivity returned Status: ok; intent delivered to an already running top-most instance. Process 17184 and resumed MainActivity confirmed. Local screenshot .tooling/orbia-phone.png visually confirms the Turkish Calendar screen renders with bottom navigation. No startup crash/error screen observed. Generated-setter warnings appear in dependency logs; these did not prevent rendering. This verifies installation/opening only, not comprehensive device QA. No apps, photos, files or user data deleted.
