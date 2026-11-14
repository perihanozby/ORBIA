# Acceptance matrix — current implementation increment

PASS refers only to the listed automated evidence. It does not establish visual/device acceptance. No full product feature is production-accepted.

| Feature | Implementation status | Test coverage/result | Visual QA | Device QA | Remaining limitations |
|---|---|---|---|---|---|
| SDK/Java/Node environment | PASS: installed versions inspected | Native build result in TEST_REPORT.md | NOT TESTED | NOT TESTED | No device access |
| Navigation/onboarding/Today | Implemented | Onboarding-to-Today interaction test | NOT TESTED | NOT TESTED | Single-page onboarding, visual polish pending |
| Tasks | Core CRUD implemented | PASS: editor/SQL, recurrence idempotence/month-end/undo and subtask tests | NOT TESTED | NOT TESTED | Time, tags, richer sort/filter controls |
| Focus Three | Implemented | PASS: domain and SQL slot/limit/date/FK tests | NOT TESTED | NOT TESTED | Device date rollover QA |
| Gentle Reset | Per-task actions implemented | Repository move operation; UI flow NOT TESTED | NOT TESTED | NOT TESTED | Dedicated choose-date workflow |
| Goals/milestones | Core workflow implemented | Editor persistence and FK/rollback tests | NOT TESTED | NOT TESTED | Life area/target date/history, milestone editing |
| Habits | Schedule/check-in/skip/undo implemented | SQL uniqueness and editor persistence tests | NOT TESTED | NOT TESTED | Streaks/adherence/archive/detail |
| SQLite/repositories | Schema version 3 implemented | Real Node SQLite CRUD/FK/rollback/migration tests | NOT TESTED | NOT TESTED | Native driver persistence across process restart |
| Notes | CRUD/search/autosave implemented | PASS: stable-ID autosave test; lifecycle QA pending | NOT TESTED | NOT TESTED | Failure/lifecycle interaction QA |
| Calendar | Date selection/agenda/add implemented | NOT TESTED | NOT TESTED | NOT TESTED | Weekday grid and week-start settings |
| Focus | Engine/checkpoints/history implemented | PASS: monotonic pause/recovery engine test | NOT TESTED | NOT TESTED | Full lifecycle and native recovery QA |
| Insights/global search | Basic real-data metrics/search implemented | NOT TESTED | NOT TESTED | NOT TESTED | Trend charts and result-empty handling |
| Daily notification | Integrated opt-in reminder | Native API mock only, delivery NOT TESTED | NOT TESTED | NOT TESTED | Individual task/habit reminders, reboot/timezone QA |
| Backup/restore | Validated JSON share/paste and transaction implemented | PASS: roundtrip/malformed/relationships/version/duplicates | NOT TESTED | NOT TESTED | File picker, platform sharing, size/performance QA |
| EN/TR/theme/settings | Current UI catalogs and persistence implemented | PASS: key parity/translation and token contrast tests | NOT TESTED | NOT TESTED | Full-product coverage as features grow |
| Brand/splash/accessibility | Partial implementation | NOT TESTED | NOT TESTED | NOT TESTED | API24–25 icon fallback, TalkBack, text scale, contrast audit |
| Android debug APK/AAB | PASS: ARM64 debug APK; AAB NOT TESTED | PASS: build/signature/bundle/16 KB structural checks | NOT TESTED | NOT TESTED | No release signing, Play submission or device QA |

