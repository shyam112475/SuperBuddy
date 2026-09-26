# CompanionHub Mobile — Design System

## Why this palette, not the usual ones

Two color stories dominate consumer apps right now: Instagram's
purple-to-pink gradient, and Facebook/Messenger's saturated blue. Both read
as "digital," "social feed," "vanity metrics." CompanionHub is about real
activities with a real person — hiking, a shared meal, a plus-one for a
wedding — so the palette leans outdoorsy and grounded instead:

| Token | Hex (light) | Use |
|---|---|---|
| `ink` | `#0F3D3E` | Primary brand color — headers, primary buttons, active nav state |
| `coral` | `#FF6B5B` | Signature accent — used sparingly for key CTAs and highlights |
| `sand` | `#E8B94A` | Secondary accent — warmth, ratings |
| `sage` | `#6B8F71` | Safety/verified/success states |
| `background` | `#FBF7F2` | Warm off-white — never stark white |

Full dark-mode equivalents live in `src/constants/theme.ts`.

## Type

- **Fraunces** (display serif) for all headlines — `variant="display"`,
  `"title"`, `"subtitle"`. This is the single biggest lever for not looking
  like every other app's bold-sans header.
- **Manrope** (humanist sans) for body/UI copy — `"body"`, `"bodyMedium"`,
  `"bodySemiBold"`, `"caption"`, `"label"`.
- **JetBrains Mono** for anything that's a real, precise fact — prices,
  timestamps, booking codes — `"mono"`. A small technical texture that
  reinforces "this is a real place, a real time."

Always go through `<AppText variant="...">` from `@/components/ui` rather
than a raw `<Text>` with inline font styles, so every screen draws from the
same six-step scale.

## The companion mark

Two overlapping circles (`CompanionMark`, `src/components/ui/CompanionMark.tsx`)
— one ink, one coral — standing in for two people's paths crossing for a
shared activity. Used as the app icon concept, splash, and empty-state
motif. Deliberately not a camera (Instagram) or a speech bubble/"f"
(Facebook/Messenger) — nothing borrowed from an existing app's visual
vocabulary.

## Interaction feel

- Buttons scale down slightly on press (not just an opacity dim) plus a
  light haptic tick — reads as more tactile/native.
- The bottom tab bar is a floating rounded pill, not an edge-to-edge bar —
  a small but real differentiator from the "OS default" look most apps ship.
- Shadows are warm-tinted (`#3A2E1F` base), never pure black — keeps the
  whole UI feeling like it's lit by the same warm light.

## Component inventory (`src/components/ui`)

`AppText`, `AppView`, `Avatar`, `Badge`, `Button`, `Card`, `CompanionMark`,
`TextField` — the complete set of primitives every screen should build
from. Add to this set rather than one-off styling a new screen.
