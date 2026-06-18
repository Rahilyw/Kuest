---
name: Kuest
description: Real life, gamified. A weekly city challenge app.
colors:
  saltwater-sky: "#F0F9FF"
  warm-sand: "#FFF7ED"
  glass-white: "#FFFFFF"
  glass-lifted: "#F8FAFF"
  ink: "#0F172A"
  slate: "#475569"
  mist: "#94A3B8"
  local-signal: "#6366F1"
  signal-soft: "#EEF2FF"
  signal-deep: "#4338CA"
  trail-green: "#16A34A"
  social-purple: "#9333EA"
  vendor-orange: "#EA580C"
  community-blue: "#2563EB"
  harbour-teal: "#0891B2"
  market-amber: "#D97706"
typography:
  display:
    fontFamily: "System (SF Pro Display / Roboto)"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1.0
  title:
    fontFamily: "System (SF Pro Display / Roboto)"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.1
  headline:
    fontFamily: "System (SF Pro Display / Roboto)"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "System (SF Pro Text / Roboto)"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "System (SF Pro Text / Roboto)"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.03em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "28px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.local-signal}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "16px"
    shadow: "0 4px 12px rgba(99,102,241,0.28)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    borderColor: "{colors.glass-lifted}"
    rounded: "{rounded.md}"
    padding: "16px"
  category-chip-active:
    backgroundColor: "{colors.local-signal}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    shadow: "0 2px 8px rgba(99,102,241,0.30)"
  category-chip-inactive:
    backgroundColor: "{colors.glass-white}"
    textColor: "{colors.slate}"
    borderColor: "rgba(15,23,42,0.06)"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  quest-card:
    backgroundColor: "{colors.glass-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
    shadow: "0 6px 16px rgba(15,23,42,0.07)"
  xp-bar-fill:
    backgroundColor: "{colors.local-signal}"
    rounded: "{rounded.pill}"
    height: "12px"
    accentBlend: "#8B5CF6 at 55% opacity on right 35%"
  input:
    backgroundColor: "{colors.glass-white}"
    textColor: "{colors.ink}"
    borderColor: "rgba(15,23,42,0.06)"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Kuest

## 1. Overview

**Creative North Star: "Saltwater Saturday"**

A 23-year-old steps out of a Victoria coffee shop at 11am on a July Saturday, oat latte in one hand, phone in the other, checking which quest to tackle first. The Inner Harbour sparkles. The sun is direct. Every storefront is colour; every awning is personality. The screen has to be readable, vivid, and feel as alive as the moment. This is the scene the interface exists inside.

The visual language is light, glass, and category colour. Surfaces are white glass that catches outdoor light, not dark rooms trying to glow. The five category colours, previously contained by a night-sky background, now breathe freely on white; they carry identity, not decoration. Local Signal indigo remains the earned accent, now vivid and unmistakable on a pale sky background rather than merely bright in a dark one.

Anti-references are unchanged and load-bearing: no AR neon (Pokémon GO), no cartoon theater (Duolingo), no performance-data density (Strava), no coupon visual language (loyalty apps). To that list, this direction adds: no muted "soft launch" aesthetic, no desaturated cool-tones minimalism, no dark-mode-with-light-switch half-measure.

**Key Characteristics:**
- Pale sky background (`#F0F9FF`); surfaces are glass-white (`#FFFFFF`) floating above it
- Glass simulation: white card + 6-7% dark shadow + 1px specular highlight on top edge
- Five category colours run at full saturation; their soft tints (100-level palette) back icon boxes
- Local Signal indigo reserved for XP values, active states, primary CTA; rarity preserved on light bg
- Typography weight-driven hierarchy: 800 weight for titles, 400 for body, no decorative size jumps
- Flat at rest; indigo glow on press for interactive elements

## 2. Colors: The Saltwater Saturday Palette

Outdoor light, five market-stall category signals, one earned indigo held for what matters.

### Backgrounds
- **Saltwater Sky** (`#F0F9FF`): The app base. Sky-50 tinted just far enough toward blue to read as outdoor light, not clinical. Every screen starts here.
- **Warm Sand** (`#FFF7ED`): Used for warm surface accents (featured quest hero, profile header). Orange-50; evokes the boardwalk.

### Surfaces (Glass Simulation)
- **Glass White** (`#FFFFFF`): All cards, inputs, tab bar. Pure white surfaces floating on the sky background; the contrast reads as elevation without shadow excess.
- **Glass Lifted** (`#F8FAFF`): Elevated surfaces: XP track background, alternating leaderboard rows, secondary section backgrounds.

### Text
- **Ink** (`#0F172A`): Primary text. Slate-900; near-black with a cool-blue trace.
- **Slate** (`#475569`): Secondary text: quest descriptions, supporting labels.
- **Mist** (`#94A3B8`): Muted: placeholder copy, disabled labels, metadata. Distance pills, timestamps.

### Accent (Local Signal)
- **Local Signal** (`#6366F1`): The earned accent. XP values, active tab/chip/button, XP bar fill, leaderboard rank. Vivid on white. Its rarity on any screen is still the point.
- **Signal Soft** (`#EEF2FF`): Indigo-50. Pill backgrounds for XP chips, "your rank" strip, selected states.
- **Signal Deep** (`#4338CA`): Indigo-700. Text on Signal Soft backgrounds.

### Category Signals (five, full saturation on white)
Category colours are identification, not emphasis. They live on icon-box soft tints, category chips, and map pins.

- **Trail Green** (`#16A34A`): Fitness. Green-600. Success states, approval confirmed.
- **Social Purple** (`#9333EA`): Social. Purple-600.
- **Vendor Orange** (`#EA580C`): Food. Orange-600. Also sponsor colour (summer energy over amber).
- **Community Blue** (`#2563EB`): Community. Blue-600.
- **Harbour Teal** (`#0891B2`): Nature. Cyan-600.

### Tertiary
- **Market Amber** (`#D97706`): Warning states. Amber-600; darkened from yellow to meet contrast on white.

### Icon Box Tints (soft category backgrounds)
Each category colour has a paired 100-level tint for the icon box background: green-100, purple-100, orange-100, blue-100, cyan-100. The emoji icon sits on the soft tint; the category colour appears as text or chip label.

### Named Rules
**The Local Signal Rule.** Local Signal indigo appears on at most 8% of any screen's visible area. On a light background it is already vivid; restrain it the same way, or it loses its "earned" quality.

**The Category Independence Rule.** Category colours identify quest type. They are never mixed with indigo, never used as emphasis, never applied to non-category labels.

**The Glass-Over-Sky Rule.** White surfaces do not need additional tinting to read as elevated. The sky-to-white contrast is the elevation signal. Do not add coloured tints to card backgrounds.

## 3. Typography

Unchanged from the prior system. System fonts, weight-driven hierarchy.

**Display** (800, 48px, 1.0): Auth wordmark only.
**Title** (800, 28px, 1.1): Screen headers.
**Headline** (700, 18-22px, 1.3): Quest card titles, section headers.
**Body** (400, 14-16px, 1.5): Descriptions, meta text.
**Label** (700, 11-13px, 1.2, tracking 0.03em): Pills, XP values, badge names.

**The Weight-Over-Size Rule** is unchanged. Jump weight before jumping size.

## 4. Elevation

Kuest is flat at rest. Elevation comes from the Saltwater Sky background contrasting against Glass White surfaces; the visual read is "floating" without needing heavy shadows.

### Shadow Vocabulary
- **Card Glass** (`shadowColor: '#0F172A', shadowOffset: {0,6}, shadowOpacity: 0.07, shadowRadius: 16`): All cards, the XP bar container, badge tiles. Consistent; not decorative.
- **Action Glow** (`shadowColor: '#6366F1', shadowOffset: {0,4}, shadowOpacity: 0.28, shadowRadius: 8`): Primary CTA buttons and active category chips. The glow signals "this does something significant."
- **Tab Lift** (`shadowColor: '#0F172A', shadowOffset: {0,-4}, shadowOpacity: 0.06, shadowRadius: 16`): Tab bar only. Faces upward to simulate the bar floating above the scroll content.

### Glass Specular
The 1px top-edge highlight (`backgroundColor: 'rgba(255,255,255,0.9)'`, absolute, `top: 0, left: 16, right: 16`) on quest cards simulates light catching the glass surface. Do not use this on every element; it belongs on the primary repeating card component.

### Named Rules
**The Flat-By-Default Rule** is unchanged. No shadow on a resting element unless it is interactive or the XP bar. Fix the background step instead.

## 5. Components

### Buttons
- **Primary:** Local Signal background, white text, 12px radius, 16px vertical padding. Action glow shadow on all states. Full-width in auth and quest detail contexts.
- **Ghost / Sign-out:** Transparent background, Glass Lifted border, Slate text. Destructive or secondary only.
- **Disabled:** 40% opacity.

### Category Chips (Filter Row)
- **Inactive:** Glass White background, 1.5px border in `rgba(15,23,42,0.06)`, Slate text, card glass shadow. Feels like a frosted pill.
- **Active:** Local Signal background, white text, action glow shadow. State is unambiguous.
- **Rule:** Chips show category labels (with emoji prefix), never category colour. Colour is on the card, not the filter.

### Quest Cards
The central repeating element. No side stripe (removed). Category identity via icon box soft tint and category pill.

- **Background:** Glass White
- **Shadow:** Card Glass
- **Specular:** 1px top highlight
- **Radius:** xl (20px)
- **Icon box:** 52x52, category soft tint (100-level), large emoji, lg radius
- **Category pill:** soft tint background, category colour text, pill radius. Top of card.
- **Sponsor pill:** warm-sand background, orange-600 border, orange-600 text.
- **XP value:** category colour, 800 weight (not indigo; XP on a card is the quest's reward, not an earned state).
- **Title:** Ink, 800 weight, 15px.

### XP Bar
The signature component. A card unto itself (Glass White bg, Card Glass shadow, xl radius).

- **Track:** Glass Lifted, 12px tall, pill radius, 1px border
- **Fill:** Local Signal base, right 35% blended toward `#8B5CF6` (violet) at 55% opacity — fakes a gradient without expo-linear-gradient
- **Fill highlight:** 50%-height white strip at 28% opacity (glass sheen)
- **Label row:** "Level N" in Ink/800, XP fraction in Mist/regular
- **Marker row:** "Lv N" and "Lv N+1" beneath the track in Mist/600 at 11px

### Avatar
Circular. Falls back to coloured initial if no photo. Initial background colour is deterministic from username hash, choosing from 7 vivid palette pairs (all are category-derived colours). Avoids generic grey silhouettes.

### Level Chip
Compact indigo pill. Local Signal background, white text, 800 weight, Action Glow shadow. Appears on profile header overlay and quest feed header.

### Inputs
- **Style:** Glass White background, no border at rest (1.5px border on focus). Ink text, Mist placeholder.
- **Radius:** md (12px). Padding 16px.

### Tab Navigation
- **Background:** `rgba(255,255,255,0.96)` — near-opaque glass white
- **Shadow:** Tab Lift (upward-facing)
- **Active:** Local Signal icon + label, filled Ionicons variant
- **Inactive:** Mist icon + label, outline Ionicons variant
- **Height:** 64px with 8px bottom, 4px top padding

### Leaderboard Row
- **Default:** flat, 1px Mist/20% bottom border, alternating Glass Lifted tint
- **Your rank strip:** Signal Soft background (`#EEF2FF`), Signal Deep username text
- **Medal emojis:** native, 20px

### Badge Tile
- Glass White, Card Glass shadow, lg radius. Emoji 30px. Name in Slate/600/11px. Empty state: yellow-100 circle icon container.

## 6. Do's and Don'ts

### Do:
- **Do** hold Local Signal to under 8% of any screen. On a light background it is more vivid; the restraint becomes more important, not less.
- **Do** use category soft tints (100-level) for icon box backgrounds. The icon gives identity; the tint is the whisper.
- **Do** use white glass surfaces floating on Saltwater Sky. The contrast is the elevation. Trust it.
- **Do** write quest copy and empty states as if a person who lives in Victoria wrote them. Generic copy fails The Local Signal Rule.
- **Do** let weight contrast carry hierarchy. 800 at 28px does not need a gradient or extra decoration.
- **Do** use full-saturation category colours on white backgrounds; they are vivid for a reason.

### Don't:
- **Don't** add a second accent colour to feel "summery." Summer energy comes from category colour saturation, not from adding coral or yellow to the brand palette.
- **Don't** use gradient text. Gradient backgrounds are already banned; gradient text is the same mistake applied to type.
- **Don't** introduce confetti, completion animations, or XP counters before a submission is approved. The "Earned not given" principle is unchanged regardless of theme.
- **Don't** use glassmorphism decoratively. The glass system is functional (surfaces lift off the sky bg) not aesthetic mood-setting. Every blur or tint should correspond to a real elevation or state difference.
- **Don't** show shadows on resting list rows, section headers, or container views. Card Glass shadow is for interactive card surfaces only.
- **Don't** use the AR neon palette of Pokémon GO. Kuest is light mode, not luminous-on-black.
- **Don't** use cartoon mascots, achievement sticker aesthetics, or Duolingo-style "you did it" full-screen moments.
- **Don't** replicate Strava's fitness-data density. One XP number. One level. No charts, no segment breakdowns.
- **Don't** design sponsor quests as coupons. Design them as quests that happen to carry a reward.
