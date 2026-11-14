# Environment audit

Audit date: 2026-11-14 (Europe/Istanbul).

- Workspace C:\Users\perih\Desktop\ORBIA exists and was empty.
- flutter and dart: not on PATH. Neither executable was found in nine common SDK locations. This is not proof that no SDK exists elsewhere.
- flutter --version, dart --version, flutter doctor -v: BLOCKED, executable unavailable.
- Java: Temurin OpenJDK 17.0.21+9, executable C:\Program Files\Eclipse Adoptium\jdk-17.0.21.9-hotspot\bin\java.exe; java -version passed.
- Git: 2.51.0.windows.1; git --version passed.
- Android SDK: C:\Android\Sdk exists. platforms/android-35, build-tools/35.0.0, cmdline-tools/latest/bin/sdkmanager.bat and platform-tools are present. Contents alone do not establish build compatibility.
- JAVA_HOME, ANDROID_HOME, ANDROID_SDK_ROOT: unset in audited process.
- adb: absent from PATH; direct adb version attempt failed with Cannot mkdir '\.android': Permission denied. No device enumeration, installation or launch was attempted.
- VS Code user settings yielded no Flutter SDK path. Access to user home directory listing was denied; no broad search through unrelated projects was performed.
- No Android Studio, emulator, SDK, dependencies, or system software installed. No global configuration changed.

## Minimal supported setup

Official instructions: https://docs.flutter.dev/install/manual and https://docs.flutter.dev/install/add-to-path . Download the current stable Windows Flutter SDK from the official archive, extract into a writable dedicated SDK directory, then add its bin directory to the terminal PATH. Flutter includes Dart; no separate Dart installation is necessary. Use the existing Java and Android SDK; Android Studio is not required for this workflow. Exact current Flutter/Gradle/Android compatibility must be checked after selecting the actual SDK, rather than inferred from Android 35 being present.

A project-local .tooling/flutter directory is an alternative to changing the system. Do not commit SDK files. Large SDK download and extraction have not been performed.

Run flutter --version, dart --version and flutter doctor -v after installation. Fix toolchain issues before dependency selection or application bootstrap. Do not create an emulator or install onto a physical device.

## Approved installation attempt — 2026-11-14

User approved official stable SDK download with checksum verification, C:\src\flutter extraction, additive user PATH configuration, existing Android/Java configuration and default project bootstrap/build. Additional Android components and physical-device installation remain unauthorized.

Official metadata URL attempted: https://storage.googleapis.com/flutter_infra_release/flutter/releases/releases_windows.json

Sandbox request failed to connect. A network-escalated retry reached Google Cloud Storage but returned NoSuchKey: No such object: flutter_infra_release/flutter/releases/releases_windows.json. Stable version and official SHA-256 could not be verified. Per explicit user instruction, installation stopped. No SDK archive downloaded, no extraction, no PATH or toolchain changes, no bootstrap or build. Next action: establish an accessible authoritative release index/checksum source before downloading any SDK archive. Existing installation authorization persists; no need to re-request the same approval.

## React Native strategy supersedes Flutter — 2026-11-14

Node 22.19.0, npm 10.9.3, Java Temurin 17.0.21 and Git 2.51.0 verified by commands. Official npm metadata: react-native latest 0.88.1, node ^22.13.0 || ^24.3.0 || >=26.0.0. Existing Node is compatible. CLI 21.0.0 used for generation (template pins its own local CLI version).

Existing Android platform 35 and Build Tools 35.0.0. NDK/CMake directories absent. Official/generated 0.88 template requires platform 37, Build Tools 37.0.0 and NDK 27.1.12297006. Approval requested before installation; none installed during this audit. Command-line tools, platform tools and android-sdk-license file present; license acceptance compatibility not yet verified. Java/Android environment variables remain unmodified.

Flutter/Dart installation cancelled by newer user instruction, regardless of earlier approval. React Native initialized in .bootstrap staging then copied to root without overwriting existing README/docs. No Android Studio, emulator or production signing credentials created. No physical-device operations.

## Approved native toolchain installation — 2026-11-14

Installed from the official Android SDK repositories using the existing command-line tools: Platform 37.0 revision 2 (API 37.0), Build Tools 37.0.0, NDK r27b / 27.1.12297006, CMake 3.22.1. Verified each source.properties after sdkmanager exited 0. Initial platforms;android-37 request failed because the repository uses platforms;android-37.0; corrected identifier succeeded. User approved Platform 37, Build Tools and NDK, then separately CMake.

Existing platform 35 and Build Tools 35.0.0 preserved. No Android Studio/emulator installed. Java and Android configuration are process-only; global/user environment entries untouched. Gradle 9.4.1 downloaded into .tooling/gradle. Native library Build Tools aligned to approved 37.0.0 at finalizeDsl; automatic SDK downloads disabled. React Navigation, Zustand, Nitro SQLite/Modules, SVG and Notifee installed as project-local dependencies; versions locked in package-lock.json.

## Verified native artifact checkpoint

ARM64 debug APK generated and structurally verified (debug signature, embedded JS, ZIP/ELF/RELRO checks). Schema version 3, backup format 2, 19 tests passing; final report contains SHA-256. Existing SDK packages and persistent environment settings preserved. Unused overlay/DND/foreground-service/legacy-dialog permissions removed from merged debug manifest. Exact-alarm permissions absent. Debug still has development Internet/local-network permissions; release overlay removes Internet but the release artifact has not been built or audited. No physical device touched.
