# ORBIA — ULTIMATE CODEX MASTER IMPLEMENTATION DIRECTIVE
## Build a World-Class, Premium, Offline-First Personal Productivity Application

You are operating as an autonomous senior engineering and product team inside VS Code.

Your roles include:

- Principal Flutter Engineer
- Senior Mobile Software Architect
- Product Design Director
- Premium UI/UX Designer
- Design Systems Engineer
- Android Platform Engineer
- Local-First Database Architect
- Accessibility Engineer
- Mobile Performance Engineer
- Quality Assurance Lead
- Security and Privacy Engineer

Your mission is to design, architect, implement, test, refine, and prepare a complete Android-first mobile application named **ORBIA**.

This is a real software development assignment.

Do not merely create a concept, wireframe, architectural document, or non-functional prototype.

Build the actual application.

The final product must be beautiful, functional, reliable, maintainable, accessible, and suitable for further production development.

---

# 0. ABSOLUTE PRIORITIES

The priorities are:

1. Correct functionality.
2. Exceptional visual design quality.
3. Comfortable, intuitive user experience.
4. Reliable offline data persistence.
5. Smooth Android performance.
6. Accessibility.
7. Maintainable architecture.
8. Real testing and verification.
9. Privacy and data integrity.
10. Honest progress reporting.

A successful compilation does not mean the application is finished.

A visually appealing screen with non-functional buttons is unacceptable.

A functional application with an amateur-looking interface is also unacceptable.

Both engineering quality and visual quality are mandatory.

---

# 1. PROJECT IDENTITY

Application name:

ORBIA

Tagline:

Make room for what matters.

Turkish tagline:

Önemli olana yer aç.

Product category:

Personal productivity and life organization.

Product vision:

ORBIA is a calm, premium personal organization application that helps users manage daily priorities, tasks, goals, habits, notes, and focus sessions without overwhelming them.

The application must be welcoming to a broad international audience.

It must not feel like enterprise software.

It must not feel like a generic to-do-list clone.

It must not feel like a student demonstration project.

It must feel like a professionally designed contemporary mobile application.

Core product principles:

- Calm productivity
- Thoughtful simplicity
- User autonomy
- Privacy
- Consistency
- Accessibility
- Clarity
- Low cognitive load
- Gentle motivation
- Useful insights
- Reliable offline operation

The application must never shame users for unfinished tasks or broken habit streaks.

Avoid manipulative engagement patterns.

---

# 2. DEVELOPMENT ENVIRONMENT

Target operating system:

Windows.

Preferred development environment:

VS Code with Codex Agent.

Project directory:

C:\Users\perih\Desktop\Orbia

Target platform:

Android first.

Framework:

Flutter stable.

Language:

Dart.

Recommended libraries:

- flutter_riverpod
- go_router
- drift
- sqlite3_flutter_libs, if appropriate for the selected compatible Drift setup
- path_provider
- flutter_local_notifications
- intl
- shared_preferences, only for suitable lightweight settings
- flutter_test
- integration_test
- mock or fake testing utilities where justified

Verify the actual current compatibility and installation requirements of each dependency before using it.

Do not blindly pin outdated versions.

Do not use Android Studio.

Do not create an emulator.

Use the existing Android SDK and Java installation when available.

Expected Android SDK location:

C:\Android\Sdk

Expected Java:

Temurin JDK 17.

Verify actual paths rather than assuming they exist.

Do not install unnecessary system-wide software without explaining why it is needed.

Do not modify any other project.

In particular, never modify:

C:\Users\perih\Desktop\LumiBlock

Only work inside the ORBIA project directory, except for normal Flutter/Android toolchain operations.

---

# 3. FIRST ACTION — ENVIRONMENT AUDIT

Before creating application code:

1. Check whether the target directory exists.
2. Inspect its contents.
3. Check whether Flutter is installed.
4. Run flutter --version if available.
5. Run dart --version.
6. Run flutter doctor -v.
7. Verify Android SDK access.
8. Verify Java.
9. Verify available build tools.
10. Check Git availability.

If Flutter is missing:

- Report the missing prerequisite.
- Explain the minimal supported installation approach.
- Do not falsely claim the environment is ready.
- Continue with safe project documentation where possible.

If Flutter is available:

Create the Flutter application in the target directory.

Use a valid temporary application ID such as:

com.orbia.productivity

Treat this as provisional until ownership and publishing identity are confirmed.

Do not use another company's registered branding or assets.

Do not change package identity later without a documented migration strategy.

---

# 4. BRAND DESIGN — SOFT HARMONY

THIS SECTION IS CRITICAL.

ORBIA must have an exceptionally refined light-first design system.

Design direction:

**SOFT HARMONY — CALM, ELEGANT, MODERN, PREMIUM.**

The application should feel:

- Light
- Airy
- Soft
- Harmonious
- Modern
- Comfortable
- Elegant
- Refined
- Friendly
- Trustworthy
- Distinctive
- Visually balanced

Avoid:

- Harsh neon
- Overly saturated colors
- Dark heavy backgrounds in the primary theme
- Excessive gradients
- Heavy drop shadows
- Random pastel colors
- Oversized cartoon illustrations
- Cheap-looking icons
- Unnecessary glassmorphism
- Cluttered dashboards
- Too many competing visual elements
- Tiny text
- Excessive animations
- Generic default Flutter appearance

The design must remain comfortable during prolonged daily use.

The interface must be visually cohesive across every screen.

## 4.1 Exact initial color palette

Create semantic design tokens based on:

Background / Warm Ivory:
#F8F7F3

Primary Surface / Pearl:
#FFFFFF

Secondary Surface / Sage Mist:
#E8EFE9

Primary Accent / Muted Sage:
#729A89

Accessible Primary Action / Deep Sage:
#416B59

Soft Blue:
#DCE8F1

Soft Lavender:
#EDE4F2

Soft Peach:
#F3E5D9

Primary Text / Charcoal:
#293631

Secondary Text:
#596861

Subtle Border:
#E4E9E3

Muted Disabled Surface:
#EEF0EB

Muted Disabled Text:
#75817B

Success:
#3F785C

Warning:
#966B3D

Error:
#A94747

The values are the initial brand direction.

Validate text and interactive control contrast.

Adjust individual semantic tokens when accessibility requires it, while preserving the Soft Harmony visual identity.

Do not use low-contrast pastel text on white backgrounds.

Pastel colors should primarily be used as supporting surfaces, category backgrounds, progress accents, and subtle highlights.

## 4.2 Color distribution

Use approximately:

- 70% neutral and warm ivory surfaces
- 20% soft supporting surfaces
- 10% functional accent colors

This is a visual guidance ratio, not a rigid pixel-level requirement.

Avoid displaying all pastel colors on every screen.

Use feature-specific accents consistently:

- Tasks: sage
- Goals: lavender
- Habits: peach
- Calendar: powder blue
- Focus: restrained sage/blue combination
- Insights: neutral surfaces with purposeful chart colors

Colors must communicate meaning.

## 4.3 Dark theme

Provide an optional dark theme after the primary light experience is implemented.

Suggested dark tokens:

Background:
#171D1B

Surface:
#232B27

Secondary Surface:
#34413B

Primary:
#B4D6BF

Primary Text:
#F2F5EF

Secondary Text:
#A9B8AF

Dark mode must be a coherent alternative, not an automatic inversion.

The light theme remains the flagship experience.

---

# 5. TYPOGRAPHY SYSTEM

Use a professional, legally usable typeface.

Preferred:

Inter, if its license and distribution requirements are satisfied.

Provide suitable fallback fonts for international text.

Use Flutter typography with a coherent scale.

Suggested typography:

Display:
30–34sp

Page Title:
26–28sp

Section Title:
18–20sp

Card Title:
16–18sp

Body:
14–16sp

Secondary:
12–14sp

Caption:
11–12sp, only where readable and appropriate.

Button:
14–16sp.

Avoid using extremely thin font weights for important content.

Use:

- Clear visual hierarchy
- Consistent line height
- Controlled letter spacing
- Tabular numerals where suitable
- Proper text wrapping
- Accessible text scaling
- No clipped labels

Every user-facing string must come from localization resources.

---

# 6. SPACING AND LAYOUT SYSTEM

Implement a consistent spacing scale:

4, 8, 12, 16, 20, 24, 32, 40, 48.

Typical screen horizontal padding:

20–24dp.

Card padding:

16–20dp.

Card corner radius:

16–20dp.

Button corner radius:

14–16dp.

Input radius:

12–14dp.

Minimum interactive target:

48×48dp, unless a larger target is needed.

Use responsive layouts rather than fixed pixel coordinates.

Support:

- Compact Android phones
- Standard phones
- Large phones
- Tablets where practical
- Portrait orientation
- System display scaling
- Larger font settings
- Keyboard appearance
- Safe areas
- Gesture navigation

Avoid RenderFlex overflow.

Do not hide important actions behind inaccessible scrolling regions.

Use consistent bottom navigation and app bars.

---

# 7. ICONOGRAPHY AND VISUAL ASSETS

Create a coherent icon system.

Use a consistent stroke weight and icon family.

Do not mix unrelated icon styles.

Avoid decorative emoji as primary interface icons.

Create a professional ORBIA brand mark.

The logo should be:

- Minimal
- Geometric
- Recognizable
- Distinctive
- Scalable
- Suitable for an Android launcher icon
- Effective on light backgrounds

Possible conceptual direction:

An abstract orbit or connected circular path representing clarity, rhythm, and personal direction.

Do not copy existing logos.

Do not assume the name ORBIA is legally available.

Record that trademark and store-name checks are required before publication.

Create:

- App launcher icon
- In-app logo
- Splash presentation
- Empty-state visual language

Use original assets or assets with verified compatible licenses.

---

# 8. MOTION AND MICROINTERACTIONS

Animations must feel premium, soft, and purposeful.

Suggested timings:

Button feedback:
100–160ms

Card expansion:
180–240ms

Page transition:
220–320ms

Progress update:
250–450ms

Completion feedback:
180–300ms

Use smooth easing.

Implement:

- Button press feedback
- Task completion transition
- Habit completion feedback
- Goal progress update
- Card appearance
- Bottom navigation selection
- Modal opening
- Snackbar appearance
- Focus timer transitions
- Subtle success states

Avoid unnecessary bouncing, flashing, particles, or confetti.

Respect reduced-motion preferences.

Animations must not block user input unnecessarily.

---

# 9. APPLICATION INFORMATION ARCHITECTURE

Primary bottom navigation:

1. Today
2. Tasks
3. Goals
4. Habits
5. More

The More screen contains:

- Calendar
- Notes
- Focus Timer
- Insights
- Settings
- Data Management
- About

Implement correct back navigation.

Preserve scroll positions and tab states where appropriate.

Avoid rebuilding entire screens unnecessarily.

Do not place important functionality behind confusing menus.

---

# 10. COMPLETE SCREEN INVENTORY

Build all required screens.

## 10.1 Splash

Requirements:

- ORBIA logo
- Warm ivory background
- Minimal presentation
- No excessive loading animation
- Correct initialization flow
- Proper error handling

## 10.2 Onboarding

Create a short onboarding experience.

Suggested pages:

1. Welcome to ORBIA
2. Organize your day
3. Build your own rhythm
4. Start with what matters

Provide:

- Skip
- Next
- Back
- Get Started

All buttons must work.

Store onboarding completion.

Do not require account creation.

Do not request unnecessary permissions.

## 10.3 Today Dashboard

This is the flagship screen.

It must be visually exceptional.

Components:

- Personalized but optional greeting
- Current date
- Focus Three priorities
- Daily progress
- Today's tasks
- Habits due today
- Goal next actions
- Gentle Reset
- Quick Add

Use real data.

Empty states must be elegant and useful.

Do not display fabricated percentages.

## 10.4 Task List

Features:

- All tasks
- Today
- Upcoming
- Completed
- Overdue
- Priority filters
- Search
- Sort
- Add task

Each task supports:

- Completion
- Undo
- Edit
- Delete
- Due date
- Priority
- Optional notes
- Optional goal link
- Optional recurrence
- Subtasks

Use swipe actions only when discoverable and accessible alternatives exist.

## 10.5 Task Editor

Fields:

- Title
- Description
- Due date
- Due time
- Priority
- Repeat rule
- Goal association
- Tags
- Subtasks

Validation:

- Non-empty title
- Valid dates
- Valid recurrence
- Clear errors
- Safe cancellation
- No accidental data loss

## 10.6 Goals

Goal list:

- Active
- Completed
- Archived

Goal creation:

- Title
- Description
- Life area
- Target date
- Milestones

Goal detail:

- Progress
- Milestones
- Linked tasks
- Activity history
- Edit
- Complete
- Archive
- Delete

Progress must be calculated from real data.

## 10.7 Habits

Habit list:

- Due today
- Completed today
- Other habits

Habit creation:

- Title
- Description
- Schedule
- Reminder
- Color/category

Habit detail:

- Weekly activity
- Calendar history
- Completion rate
- Current streak
- Best streak
- Edit
- Archive
- Delete

Implement accurate date-based completion tracking.

Support undo and skipped days.

## 10.8 Calendar

Implement:

- Monthly view
- Date navigation
- Selected-day agenda
- Task indicators
- Habit context
- Add task on date
- Date-specific details

Do not pretend external calendar sync exists.

## 10.9 Notes

Implement:

- Notes list
- Create note
- Edit note
- Autosave
- Search
- Delete
- Confirmation where appropriate

Use a clean, distraction-free editor.

## 10.10 Focus Timer

Implement:

- Configurable session duration
- Start
- Pause
- Resume
- Finish
- Cancel
- Session history
- Total focus time

Timekeeping must remain accurate across app backgrounding.

Handle process termination explicitly.

Do not claim continuous background execution unless actually supported.

## 10.11 Insights

Show:

- Completed tasks
- Task completion trends
- Habit adherence
- Goal progress
- Focus minutes
- Weekly activity

Use real persisted data.

Use elegant, restrained charts.

Avoid decorative charts without meaning.

Handle zero-data cases.

## 10.12 Global Search

Search across:

- Tasks
- Goals
- Habits
- Notes

Provide:

- Query input
- Debouncing where appropriate
- Grouped results
- Empty results
- Navigation to selected items

## 10.13 Settings

Implement working settings:

- Language
- Appearance
- Notification preferences
- Reduced motion
- Week start day
- Data export
- Data import
- Privacy
- About

All changes must persist.

No decorative switches.

## 10.14 Data Management

Implement:

- Export
- Import
- Restore preview
- Confirmation
- Validation
- Clear error messages

Do not silently overwrite data.

Use versioned backup formats.

---

# 11. CORE DOMAIN MODEL

Design proper domain entities.

Suggested entities:

Task
Subtask
Goal
Milestone
Habit
HabitOccurrence
HabitCompletion
Note
FocusSession
UserPreference
Reminder
LifeArea

Use stable identifiers.

Store timestamps consistently.

Distinguish:

- UTC timestamps
- Local calendar dates
- User-selected local times
- Time zone information where necessary

Avoid storing date-only values as ambiguous timestamps.

Define explicit recurrence semantics.

Document relationships and invariants.

---

# 12. DATABASE ARCHITECTURE

Use Drift with SQLite.

Create repositories for each domain.

Requirements:

- Schema versioning
- Foreign keys
- Indexes
- Transactions
- Migration tests
- Referential integrity
- Safe delete behavior
- Real persistence
- Query performance

Do not store the primary task database in SharedPreferences.

Use SharedPreferences only for appropriate lightweight settings.

Implement database initialization and recovery paths.

Do not delete a corrupted database automatically.

Do not lose user data silently.

---

# 13. FOCUS THREE BUSINESS RULES

Allow the user to designate a maximum of three daily priority tasks.

Requirements:

- Maximum three active selections per day
- Explicit user selection
- Persistent selections
- Correct completion behavior
- Correct date transitions
- Ability to replace selections
- No automatic destructive changes

Define the exact behavior in domain tests.

---

# 14. GENTLE RESET BUSINESS RULES

Provide a calm workflow for overdue tasks.

Possible actions:

- Move to today
- Choose another date
- Keep in backlog
- Mark complete
- Delete

Never silently move all overdue tasks.

Never shame the user.

Never misrepresent incomplete tasks as completed.

---

# 15. GOAL PATH BUSINESS RULES

Goals contain milestones.

Define progress clearly.

Recommended initial behavior:

- Milestones contribute to progress.
- Each milestone has a completion state.
- Progress is based on completed milestones.
- Linked tasks are displayed separately unless explicitly incorporated into a documented calculation.

Handle goals with zero milestones gracefully.

Do not divide by zero.

---

# 16. HABIT BUSINESS RULES

Support:

- Daily habits
- Selected weekdays
- Completion per local calendar date
- Undo
- Skip
- Streak calculation
- Historical calendar
- Reminder settings

A habit should not accidentally receive duplicate completion records for the same date.

Use appropriate uniqueness constraints.

Handle daylight saving transitions and date changes.

Do not make incorrect assumptions about a fixed 24-hour local day.

---

# 17. FOCUS TIMER ENGINE

Use a testable timer engine.

Do not calculate elapsed focus time solely by counting UI timer ticks.

Use monotonic elapsed-time tracking while the process is alive.

Persist enough state to recover safely after backgrounding or restart.

Distinguish actual elapsed time from unverified time after process termination.

Define whether unfinished sessions count toward insights.

Test pause/resume and lifecycle transitions.

---

# 18. NOTIFICATION SYSTEM

Implement local reminders using supported Android APIs.

Requirements:

- Permission handling
- Reminder scheduling
- Reminder cancellation
- Rescheduling after edits
- Behavior after restart
- Time zone handling
- Clear notification channels
- Notification preference settings

Check Android API requirements for exact alarms.

Avoid exact-alarm permissions unless truly justified.

Never request unrelated permissions.

If notifications cannot be fully verified without a physical device, mark them as requiring device validation.

---

# 19. BACKUP AND RESTORE

Create a versioned export format.

Include:

- Schema version
- Export timestamp
- Tasks
- Goals
- Habits
- Notes
- Focus sessions
- Relevant settings

Validate:

- File format
- Schema version
- Required fields
- IDs
- Relationships
- Duplicate records
- Unsupported future versions

Provide a restore preview.

Use transactional restore.

Prevent partial destructive imports.

Do not claim backups are encrypted unless encryption is actually implemented.

---

# 20. LOCALIZATION

Implement complete Turkish and English localization.

Use Flutter ARB localization.

All user-facing strings must be localized.

Include:

- Navigation
- Buttons
- Forms
- Errors
- Empty states
- Dialogs
- Notifications
- Onboarding
- Settings
- Insights

Use correct pluralization.

Use locale-aware date and number formatting.

Prepare architecture for future additional languages.

Do not claim unsupported languages are complete.

---

# 21. ACCESSIBILITY

Implement:

- Semantic labels
- Screen reader support
- Minimum touch targets
- Accessible color contrast
- Text scaling
- Reduced motion
- Logical focus order
- Accessible error messages
- Non-color-only feedback
- Keyboard handling
- RTL compatibility

Test critical screens at increased text scale.

---

# 22. RESPONSIVE DESIGN

Do not design only for one phone size.

Support at least these test configurations:

- 360×800 logical pixels
- 390×844 logical pixels
- 412×915 logical pixels
- Larger Android screens
- Increased text scaling

Check:

- Overflow
- Keyboard overlap
- Bottom navigation
- Dialog positioning
- Scroll behavior
- Form usability
- Safe areas
- Landscape behavior where supported

Use constraints and adaptive layouts.

---

# 23. PERFORMANCE

Targets:

- Smooth scrolling
- Responsive input
- Efficient database queries
- No unnecessary rebuilds
- Efficient lists
- Stable navigation
- Controlled animation cost
- Minimal startup delay

Use lazy lists for potentially large collections.

Avoid expensive synchronous operations on the UI thread.

Profile real performance before making claims.

---

# 24. SECURITY AND PRIVACY

The application is offline-first.

Do not add:

- Analytics SDKs without authorization
- Advertising SDKs
- Hidden telemetry
- Unnecessary accounts
- Unnecessary network calls
- Unnecessary permissions

Document actual data storage.

Do not falsely claim encryption.

Protect import/export operations from malformed input.

Do not expose sensitive user data in logs.

---

# 25. PROFESSIONAL ARCHITECTURE

Use feature-oriented structure.

Suggested organization:

lib/
  app/
    app.dart
    router/
    theme/
    localization/
  core/
    database/
    models/
    services/
    widgets/
    utilities/
  features/
    onboarding/
    today/
    tasks/
    goals/
    habits/
    calendar/
    notes/
    focus/
    insights/
    search/
    settings/
    backup/

Within each feature, separate domain, data, application/state, and presentation responsibilities where justified.

Do not introduce unnecessary layers for trivial functionality.

Use Riverpod consistently.

Avoid business logic inside large UI build methods.

Use repositories and testable services.

---

# 26. UI COMPONENT LIBRARY

Create reusable components:

OrbiaAppShell
OrbiaScaffold
OrbiaTopBar
OrbiaBottomNav
OrbiaPrimaryButton
OrbiaSecondaryButton
OrbiaTextButton
OrbiaIconButton
OrbiaCard
OrbiaSectionHeader
OrbiaTextField
OrbiaDatePicker
OrbiaTimePicker
OrbiaTaskTile
OrbiaGoalCard
OrbiaHabitCard
OrbiaMetricCard
OrbiaProgressBar
OrbiaEmptyState
OrbiaErrorState
OrbiaLoadingState
OrbiaConfirmationDialog
OrbiaSnackbar
OrbiaSearchField
OrbiaFilterChip
OrbiaSegmentedControl

Use consistent design tokens.

Every component must support appropriate interaction states.

---

# 27. QUALITY ASSURANCE

Create meaningful automated tests.

## Unit tests

- Task validation
- Task recurrence
- Focus Three limit
- Goal progress
- Habit schedules
- Habit completion uniqueness
- Streak calculations
- Focus timer behavior
- Date handling
- Insights calculations

## Database tests

- CRUD
- Foreign keys
- Transactions
- Migration
- Restore
- Data integrity

## Widget tests

- Navigation
- Task creation
- Task completion
- Goal creation
- Habit tracking
- Settings
- Localization
- Dialogs
- Empty states
- Error states

## Integration tests

- Onboarding to Today
- Create and complete task
- Create and update goal
- Create and track habit
- Save and reload data
- Export and restore
- Focus session
- Notification configuration

## Visual QA

Check:

- Typography consistency
- Spacing consistency
- Color harmony
- Contrast
- Component alignment
- Overflow
- Empty states
- Long text
- Dark mode
- Large text
- Android screenshots

Do not claim visual perfection based only on passing widget tests.

---

# 28. REQUIRED BUILD VALIDATION

Run appropriate commands:

flutter pub get

dart format .

flutter analyze

flutter test

flutter build apk --debug

If commands fail:

1. Read the error.
2. Identify the root cause.
3. Fix it.
4. Rerun validation.
5. Record the result.

Do not hide failures.

Do not report success when a command was not executed.

---

# 29. REAL ANDROID DEVICE TESTING

Use the connected physical Android device only after explicit user authorization.

Do not install or launch the APK automatically without permission.

When authorized, verify:

- Installation
- First launch
- Onboarding
- Navigation
- Task persistence
- Goal persistence
- Habit tracking
- Notes
- Focus timer
- Notifications
- Theme switching
- Language switching
- Background/foreground behavior
- App restart
- Responsive layout
- Performance

Record device-specific issues.

Do not equate successful APK export with successful device QA.

---

# 30. DEVELOPMENT EXECUTION PHASES

PHASE 0:
Environment verification and project bootstrap.

PHASE 1:
Brand identity, design tokens, typography, app shell and navigation.

PHASE 2:
Database, repositories, settings persistence and domain models.

PHASE 3:
Today dashboard, task system and Focus Three.

PHASE 4:
Goals, milestones and Goal Path.

PHASE 5:
Habits, schedules and completion history.

PHASE 6:
Notes, calendar and focus timer.

PHASE 7:
Insights, search and Gentle Reset.

PHASE 8:
Notifications, backup and restore.

PHASE 9:
Localization, accessibility and dark theme.

PHASE 10:
Visual refinement, animation, responsive QA and performance.

PHASE 11:
Automated tests, Android debug build and release preparation.

Each phase must include:

- Actual implementation
- Tests
- Error fixing
- Progress documentation
- Acceptance verification

Continue to the next feasible phase after validation.

Do not stop after creating the folder structure.

Do not substitute a design mockup for functional code.

---

# 31. DESIGN REVIEW GATES

At the end of major UI phases, evaluate:

1. Does the screen look professionally designed?
2. Is the hierarchy immediately understandable?
3. Are the colors harmonious?
4. Is the screen comfortable to read?
5. Are buttons easy to tap?
6. Are spacing and alignment consistent?
7. Are animations restrained and polished?
8. Does every visible action work?
9. Does the screen handle empty data?
10. Does the screen handle long localized text?

If a screen fails these checks, refine it before declaring the phase complete.

---

# 32. ACCEPTANCE MATRIX

Create a traceable acceptance matrix.

For every feature record:

- Feature name
- Implementation status
- Test coverage
- Test result
- Visual QA result
- Android device QA result
- Known limitations

Use statuses:

PASS
FAIL
BLOCKED
NOT TESTED

Never mark a feature PASS solely because its files exist.

---

# 33. CONTINUITY AND DOCUMENTATION

Create and maintain:

docs/PRODUCT_REQUIREMENTS.md

docs/BRAND_GUIDELINES.md

docs/DESIGN_SYSTEM.md

docs/ARCHITECTURE.md

docs/DATABASE_SCHEMA.md

docs/IMPLEMENTATION_PROGRESS.md

docs/ACCEPTANCE_MATRIX.md

docs/TEST_REPORT.md

docs/ANDROID_QA.md

docs/NEXT_SESSION.md

After each phase update progress.

If the session ends, document:

- Completed files
- Verified features
- Failed tests
- Remaining work
- Exact next steps
- Commands needed to resume

This allows future Codex sessions to continue without repeating completed work.

---

# 34. SAFETY RULES

Never delete unrelated files.

Never modify the LumiBlock project.

Never overwrite user data without confirmation.

Never silently reset the database.

Never install the APK on a physical device without authorization.

Never publish to Google Play automatically.

Never create a production keystore without a deliberate release plan.

Never claim an external service is integrated unless it actually is.

Never use copyrighted assets without appropriate rights.

Never hide incomplete functionality.

---

# 35. FINAL DEFINITION OF DONE

ORBIA is complete only when:

- All required screens are implemented.
- All visible buttons and menus work.
- All core user actions persist correctly.
- Today Compass uses real data.
- Focus Three enforces its rules.
- Goals and milestones calculate correctly.
- Habit history is reliable.
- Notes persist.
- Focus sessions work.
- Insights show real metrics.
- Notifications are correctly integrated.
- Backup and restore are tested.
- Turkish and English are complete.
- Light and dark themes are consistent.
- Soft Harmony design is polished.
- Accessibility is verified.
- Responsive layouts are verified.
- Automated tests pass.
- Android debug APK builds.
- Real-device QA is completed after authorization.
- Outstanding limitations are documented.

Do not declare the app production-ready while any critical criterion remains unverified.

---

# 36. START NOW

Begin by auditing the local development environment.

Then initialize the ORBIA Flutter project.

Implement the actual application through the defined phases.

Prioritize real functionality and exceptional Soft Harmony visual quality equally.

Do not respond with only a development plan.

Do not stop after generating placeholder screens.

Write real code, run real tests, correct failures, and maintain accurate progress documentation.

Your goal is to deliver a distinctive, elegant, reliable, and genuinely useful mobile application.

**ORBIA must feel like a premium product from its first screen to its smallest interaction.**