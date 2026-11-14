# Privacy policy preparation — factual draft

Not a published policy. Publisher identity, contact details and public policy URL have not been supplied. Final wording and dependency/permission review must precede Play submission.

ORBIA currently stores tasks, goals, milestones, habits, dated check-ins, notes, focus-session checkpoints and preferences in an app-private SQLite database on the Android device. ORBIA does not implement custom database encryption. Android application backup is disabled in the manifest.

No user account, advertising SDK, analytics integration or cloud synchronization is configured. Release configuration removes the Internet permission; final merged release manifest and all native dependencies must still be audited before making a final collection declaration. Development builds use React Native development tooling and may have Internet access for debugging.

Notifications are optional. Enabling reminders requests Android notification permission and schedules an inexact daily notification locally. Exact-alarm permissions are explicitly removed. Notification delivery, reboot recovery and timezone behavior need authorized device validation.

Exports contain unencrypted JSON. Choosing a destination in Android's share sheet sends that content to the app or service the user selects; its own policies then apply. Import replaces local data only after validation, preview and explicit confirmation. ORBIA does not control copies exported outside the app.

Users can delete individual records and uninstall the app to remove its private data. Exported copies remain wherever the user saved or shared them and must be removed separately. No production crash-reporting service is configured. Device/OS crash diagnostics are outside ORBIA's own analytics implementation.

Before publication: supply publisher/contact details, verify dependency behavior and all permissions, finish backup/deletion QA, host an accurate public policy, complete Play Data Safety from verified release behavior and review account-specific testing requirements. This draft does not establish legal compliance.
