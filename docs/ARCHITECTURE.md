# Architecture — current React Native strategy

2026-11-14: Supersedes Flutter, Dart, Riverpod, Drift and ARB-specific choices in historical documents. Preserve original product behavior and Soft Harmony design. No Flutter/Dart installation. Native Android Gradle project; no PWA substitution.

Baseline: React Native 0.88.1 official community template; TypeScript, Hermes; minimum Android API 24; compile API 37; target API 36; Build Tools 37.0.0; NDK 27.1.12297006; Kotlin 2.2.0; Gradle wrapper 9.4.1. Node package requires ^22.13.0 || ^24.3.0 || >=26.0.0, satisfied by installed 22.19.0. Java 17 reused.

Provisional application ID com.orbia.productivity; Kotlin namespace com.orbia is independent. Global uniqueness and ownership are unverified. Release signing deliberately unconfigured; no production credentials generated. Template debug keystore is for local debug builds only.

Planned: React Navigation for preserved tab/stack navigation; Zustand for lightweight application state; SQLite source of truth via a maintained native driver selected after actual native compatibility testing. Nitro SQLite is a candidate, not an implemented integration. Per-feature repositories, versioned SQL migrations, FK constraints, indexes and transactions. Do not store primary data in key/value preferences. English/Turkish typed translation catalogs replace ARB; locale-aware dates and plurals. Reminder and backup bridges must be validated on Android. No cloud, telemetry, ads or accounts.

src/domain contains independent invariants, src/theme contains semantic palettes. Planned feature modules: today, tasks, goals, habits, notes, calendar, focus, insights, search, settings, backup. Domain logic remains independent of React and native modules. Database errors expose recovery without deleting files; failed writes must not show false success.

Focus Three: explicit selections per calendar date, maximum three including completed tasks until explicitly replaced. Habit state unique per habit/date; skip excluded from adherence denominator; no fixed 24-hour assumptions. Goals use completed / total milestones; zero milestones gives zero. Timer uses native monotonic timing with verified persisted checkpoints and explicit process-death recovery, never JS tick counting. Transactional restore validates all records before confirmation/replacement.

Official sources: https://reactnative.dev/versions ; https://reactnative.dev/docs/set-up-your-environment ; https://raw.githubusercontent.com/react-native-community/template/0.88-stable/template/android/build.gradle ; npm registry metadata queried directly for react-native@latest.

## Native persistence now implemented

Nitro SQLite/Modules, React Navigation, Zustand, SVG and Notifee are actual installed dependencies, locked by package-lock.json. SQLite repository schema is version 3, including focus sessions; consult DATABASE_SCHEMA.md. JS catalogs replace ARB. No Riverpod/Drift code is used. src/features/workspace currently groups multiple screens and should be split as feature detail grows. Repositories and domain services remain outside build/render methods.

