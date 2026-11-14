# Design system specification

Planned tokens, not implemented components.

Spacing: 4/8/12/16/20/24/32/40/48 dp. Screen padding 20–24; cards 16–20 padding and radius; buttons 14–16 radius; inputs 12–14 radius. Minimum targets 48 by 48 dp.

Typography: display 30–34, page 26–28, section 18–20, card 16–18, body 14–16, secondary 12–14 sp. Respect system text scaling and wrap localized labels.

Dark: background #171D1B, surface #232B27, supporting #34413B, primary #B4D6BF, text #F2F5EF, secondary #A9B8AF.

Reusable shell, navigation, cards, fields, buttons, pickers, task/goal/habit tiles, metrics, progress, search, chips, dialogs and feedback must share tokens. Loading/error/empty/disabled/focus/pressed states required.

Motion: feedback 100–160ms, cards 180–240ms, navigation 220–320ms; respect reduced motion. Test 360x800, 390x844, 412x915, larger screens and large text. Visual/device QA NOT TESTED.

## Implemented increment

src/theme/tokens.ts now implements both palettes. src/ui contains shared controls, a consistent SVG icon family, and an original orbit mark. Semantic controls expose checkbox/button state, use 48dp targets, allow text scaling and wrap labels. Editor transitions obey Android reduced-motion preference. Theme contrast combinations are checked in __tests__/theme.test.ts. Onboarding, cards and layout still require native screenshots, TalkBack and large-text QA; passing contrast tests does not establish visual or accessibility acceptance. The task list is virtualized; other long collections still need refinement.
