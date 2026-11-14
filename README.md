# ORBIA

Make room for what matters. / Önemli olana yer aç.

Native Android app using React Native CLI 0.88.1, TypeScript, React Navigation, Zustand and SQLite. The Soft Harmony light/dark interface includes onboarding, Today, tasks, Focus Three, goals/milestones, habits, notes, calendar, search, basic insights, focus sessions, daily reminders and JSON backup/restore.

This is an implementation increment. See [progress and missing features](docs/IMPLEMENTATION_PROGRESS.md), [verification evidence](docs/TEST_REPORT.md), [acceptance matrix](docs/ACCEPTANCE_MATRIX.md) and [resume instructions](docs/NEXT_SESSION.md). No claim of production readiness or device QA.

```powershell
npm ci
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

Native build environment and exact commands are in docs/NEXT_SESSION.md. Debug builds include the JavaScript bundle for offline use. Do not run npm run android or installDebug without explicit physical-device authorization.

No Flutter/Dart, Android Studio, emulator, analytics, advertisements or accounts. Original requirements preserved in docs/MASTER_DIRECTIVE.md; newer React Native instructions supersede Flutter-only choices. Production signing and publication require a deliberate separate release plan.
