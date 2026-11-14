# Test report — 2026-11-14 final checkpoint

## Executed verification

| Check | Result | Evidence / scope |
|---|---|---|
| SDK installation | PASS | sdkmanager exited 0; source.properties inspected for Platform 37.0 revision 2, Build Tools 37.0.0, NDK 27.1.12297006 and CMake 3.22.1 |
| Formatting | PASS | Prettier executed on changed TS/TSX/test/config files |
| TypeScript | PASS | npx tsc --noEmit, exit 0 |
| ESLint | PASS with warnings | npm run lint, exit 0; 0 errors, 32 warnings, primarily inline styles plus render callback guidance |
| Automated tests | PASS | npm test -- --runInBand: 9 suites, 19 tests, 0 failures; last run 8.057 seconds |
| Metro standalone Android bundle | PASS | Explicit bundle command produced JS and 19 assets; Gradle subsequently bundles current JS into APK |
| Android debug build | PASS, ARM64 only | Gradle assembleDebug with -PreactNativeArchitectures=arm64-v8a and SDK auto-install disabled; final build 43 seconds, 262 tasks |
| Embedded JS / native ELF checks | PASS | scripts/verify_apk.py: embedded JS present, all 16 ARM64 libraries meet checked LOAD/RELRO criteria |
| ZIP alignment | PASS | zipalign -c -P 16 4, exit 0 |
| APK signature | PASS | apksigner verify, exit 0; standard debug signing, not production credentials |
| Manifest identity/target | PASS | Generated merged debug manifest: com.orbia.productivity, target API 36 |
| Native device / visual / TalkBack / performance | NOT TESTED | No physical-device authorization, emulator or device access |
| Release AAB / signing / Play submission | NOT TESTED | No production credentials generated and no publication |

## Final APK

Path: android/app/build/outputs/apk/debug/app-debug.apk

ABI: arm64-v8a only. Size: 62,264,570 bytes.

SHA-256: AEDD00575E3E804A50CEAE0BE476C808D10CB050BE4270FE7336059A9757B408

This APK includes the actual ORBIA feature implementation, schema version 3, repeating tasks and subtasks; it is not the default template. Embedded JS supports offline startup without Metro. Successful packaging does not verify startup or native persistence on a device.

## Automated coverage

- Domain: title/date validation, Focus Three limits/idempotence/date isolation, goal progress and habit-record uniqueness.
- Actual Node SQLite: CRUD, foreign keys, cascade/SET NULL behavior, transactions/rollback, initial schema, future-version rejection, version 1-through-3 migration, disk-file close/reopen persistence.
- Interactions: onboarding to Today; task editor save and completion; goal/milestone and habit creation; localization catalog parity; stable-ID note autosave.
- Backup: roundtrip, relationship/duplicate/malformed/future-version rejection, legacy format compatibility, recurring successor/subtask restoration.
- Recurrence: daily/weekly calendar boundaries and leap/month-end clamping; exactly one successor after repeated completion/undo; subtask progress preservation and reset in new occurrences.
- Focus: monotonic elapsed time, pause/resume and process-dead-time exclusion.
- Theme: key body/secondary/button contrast pairs at least 4.5:1. This is not full accessibility certification.

Native SQLite and notifications are mocked only at the JS/native boundary in interaction tests. Repository tests execute real desktop SQLite; they do not replace testing Nitro SQLite on Android.

## Failures encountered and disposition

- platforms;android-37 unavailable: corrected to official package ID platforms;android-37.0.
- First dotted Gradle property was split by PowerShell, shadowing the Android extension: fixed quoting.
- Library default Build Tools 36.0.0 was absent: finalized library configuration to use approved installed Build Tools 37.0.0, without installing another version.
- Initial four-ABI build explicitly stopped to validate current source as ARM64; universal/multi-ABI APK completion is not claimed.
- Jest ESM/native test setup and Node SQLite types corrected. One UI test hit its original 5-second timeout during native compilation; timeout increased to 30 seconds and final suite passed. No failed assertions suppressed.
- Initial custom RELRO check was overly strict. Corrected against Android's documented separate-LOAD exception; all libraries rechecked. Source: https://developer.android.com/guide/practices/page-sizes . Device runtime compatibility still unverified.
- apkanalyzer permissions succeeded; subsequent binary manifest identity/target queries encountered AccessDenied. Identity/target verified from generated merged XML instead. No device involved.

Known warnings: Gradle/AGP and dependency deprecations; 32 ESLint warnings. npm installation audit reported 17 findings (9 low, 8 moderate); earlier production-only audit reported 4 low CLI/deepmerge findings. No forced or incompatible dependency downgrade applied; final release dependency audit remains required.

## Not verified

Full product completeness, recurrence DST device behavior, all locales at large text sizes, native SQLite process restart, notification delivery/reboot/timezone handling, timer process-death integration, file sharing, frame timing, other ABIs and release AAB. No production-ready claim.
