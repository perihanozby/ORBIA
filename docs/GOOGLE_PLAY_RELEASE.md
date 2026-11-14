# Google Play release preparation

Not ready for submission. Recheck requirements at release time.

Verified 2026-11-14: new phone apps/updates require target API 36 from August 31, 2026. Native template targets 36 and compiles with 37. Source: https://support.google.com/googleplay/android-developer/answer/11926878 .

Native libraries must support 16 KB pages; verify ELF LOAD/RELRO and ZIP alignment for all ABI libraries, including SQLite and Hermes. Do not assume template choice proves compliance. Source: https://developer.android.com/guide/practices/page-sizes .

Remaining release gates:
- Confirm owned globally unique app ID and ORBIA name/trademark clearance before publication.
- Approved signing and credential custody plan; no production key generated. Release signing intentionally unconfigured. Future AAB command: gradlew.bat -p android bundleRelease (not run).
- Original adaptive launcher icon and Android splash; current assets are template assets.
- Privacy policy accurately describing on-device SQLite, export files, permissions, retention/deletion and actual SDK behavior. No encryption claim without implementation.
- Data Safety declaration derived from final dependency/network audit; offline-first alone does not establish the correct declaration.
- Permission/reminder handling, process-death recovery, backup validation, accessibility and performance verification.
- Authorized physical-device QA and Play testing/account-specific requirements reviewed in the actual console.
- Signed AAB validation, versioning, mapping/symbol retention, content rating and store assets.

No app publication, production signing or physical-device install/launch is authorized.

Artifact checkpoint: ARM64 debug APK with embedded JS, debug signature and 16 KB structural checks passed; no 16 KB device runtime claim. Core body/button contrast pairs pass automated checks. English/Turkish current UI catalogs, native SQLite schema version 3 and backup format 2 are implemented. Remaining product and release gates are tracked in IMPLEMENTATION_PROGRESS.md and TEST_REPORT.md. Production signing and AAB validation remain outstanding.
