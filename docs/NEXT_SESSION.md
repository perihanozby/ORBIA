# Next session — current native strategy

Do not install Flutter/Dart. User approved SDK Platform 37, Build Tools 37.0.0, NDK 27.1.12297006, and separately CMake 3.22.1; all four installed from official SDK repositories. Exact platform package identifier is platforms;android-37.0. Existing SDK 35 components preserved. No Android Studio/emulator or production keys created.

Native app source exists: App.tsx, src/app, src/data, src/domain, src/features, src/theme, src/ui. Read IMPLEMENTATION_PROGRESS.md for implemented features and explicit gaps; TEST_REPORT.md for final command evidence. Original master directive remains MASTER_DIRECTIVE.md; React Native strategy supersedes Flutter-only instructions.

Process-only environment for builds:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.21.9-hotspot'
$env:ANDROID_HOME = 'C:\Android\Sdk'
$env:GRADLE_USER_HOME = Join-Path (Get-Location) '.tooling\gradle'
```

No persistent PATH/environment changes required. Use the project-local Gradle cache; preserve SDK files. Quote dotted Gradle properties in PowerShell to avoid splitting them. Automatic SDK installation must remain disabled; any further SDK component needs separate approval.

```powershell
npm ci
npx tsc --noEmit
npm run lint
npm test -- --runInBand
.\android\gradlew.bat -p android assembleDebug '-Pandroid.builder.sdkDownload=false' --console=plain
```

For faster physical-phone-oriented debug iteration, pass '-PreactNativeArchitectures=arm64-v8a'; document that an ARM64-only APK does not establish all-ABI compatibility. Default project still lists four ABIs. Debug builds now bundle JS for offline use. Do not use npm run android or installDebug: no physical-device installation/launch approval.

Build logs: .tooling/build.log (ignored). First build populated caches and compiled native dependencies; changes to navigation/SVG/Notifee require a fresh build before accepting an APK. Do not claim a stale artifact represents current source.

Continue the outstanding features and QA from IMPLEMENTATION_PROGRESS.md. Verify native SQLite reopening, autosave, focus background/restart recovery, notification delivery/denial/reboot/timezone changes, export/import sharing and large text on an authorized device. Device QA and production signing/publication remain unauthorized. No need to re-request previously approved SDK packages.

## Latest result — resume here

Current ARM64 APK successfully built, signed with debug key and checked for embedded JS plus 16 KB ZIP/ELF/RELRO structure. 19/19 tests across 9 suites pass; TypeScript passes; ESLint passes with 32 warnings. See TEST_REPORT.md for exact artifact hash and build history. Schema is version 3 (non-destructive migrations), backup format 2 with format 1 compatibility. Recurrence/subtasks implemented after first native success. Do not reinitialize the project.

No device QA is authorized yet. Next: obtain explicit permission for physical-device install/launch/QA on the concrete debug artifact; meanwhile continue remaining implementation gaps from IMPLEMENTATION_PROGRESS.md. Do not treat debug artifact verification as visual/runtime/Play acceptance.
