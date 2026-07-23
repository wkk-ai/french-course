---
name: Linguistique Moderne
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#424751'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#727783'
  outline-variant: '#c2c6d3'
  surface-tint: '#175ead'
  primary: '#003e7a'
  on-primary: '#ffffff'
  primary-container: '#0055a4'
  on-primary-container: '#afccff'
  inverse-primary: '#a8c8ff'
  secondary: '#b71513'
  on-secondary: '#ffffff'
  secondary-container: '#db3329'
  on-secondary-container: '#fffbff'
  tertiary: '#1a4800'
  on-tertiary: '#ffffff'
  tertiary-container: '#276200'
  on-tertiary-container: '#6fe52b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#004689'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930006'
  tertiary-fixed: '#87fe45'
  tertiary-fixed-dim: '#6be026'
  on-tertiary-fixed: '#082100'
  on-tertiary-fixed-variant: '#1f5100'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  success: '#58CC02'
  warning: '#FF9600'
  reading-bg: '#FFFFFF'
  ink-dark: '#3C3C3C'
  ink-medium: '#777777'
  syntax-noun: '#0055A4'
  syntax-verb: '#EF4135'
  syntax-adj: '#58CC02'
typography:
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-reading:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-ui:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '900'
    lineHeight: 16px
    letterSpacing: 0.05em
  syntax-label:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width-reading: 680px
---

## Brand & Style

This design system translates the playful, gamified energy of a language learning leader into a sophisticated tool for high-density reading and linguistic analysis. The style is **Optimistic Modernism**—blending the approachable friendliness of rounded geometric forms with the rigorous clarity required for academic study.

The primary aesthetic draws from **Tactile Minimalism**. It utilizes subtle 3D depths on interactive elements to encourage engagement, while maintaining a vast amount of "breathable" white space to minimize cognitive load during long-form reading. The interface should feel like a premium educational tool: encouraging, precise, and highly legible.

## Colors

The palette is anchored by the "French Tricolore" interpreted through a digital lens. 

- **Primary French Blue** is used for structural UI elements and noun identification.
- **Accent French Red** is reserved for critical actions, verb identification, and high-priority errors.
- **Success Green** provides the "reward" signal for progress and correct inputs.
- **Warning Orange** is used for alerts and intermediate feedback.

The background ecosystem uses `#F7F7F7` for the application shell to define boundaries, while shifting to pure `#FFFFFF` for the main reading canvas to ensure maximum contrast and comfort for the eyes.

## Typography

This system uses a dual-font strategy:
1. **Nunito Sans** handles the UI layer. Its rounded terminals provide the friendly, approachable "Duolingo-esque" vibe for buttons, navigation, and badges.
2. **Source Serif 4** is the workhorse for reading exercises. It is a robust, highly legible serif that reduces fatigue during deep analysis, providing enough character to distinguish subtle linguistic marks.

**Linguistic Annotations:**
- **Silent Letters:** Use 40% opacity with a `text-decoration: line-through` style.
- **Liaisons:** Represented by a small, thin SVG arc (`path`) positioned under the word junction, colored in `ink-medium`.
- **Syntax Highlighting:** Applied via background tints or underlines using the `syntax-*` color tokens.

## Layout & Spacing

The system follows a **Fluid-to-Fixed** hybrid grid. The interface elements (sidebars, progress headers) occupy a fluid 12-column grid, while the central reading experience is constrained to a max-width of `680px` to maintain an ideal line length for reading.

Spacing is built on a 4px base unit. Component internal padding should be generous to maintain the "friendly" feel, specifically using 16px or 24px vertical padding on cards to avoid a cramped, "data-heavy" appearance.

## Elevation & Depth

Unlike traditional material design, this system avoids blurry ambient shadows. Instead, it uses **Tonal Offsets and 3D Borders**:

- **Layer 0:** Background shell (`#F7F7F7`).
- **Layer 1:** Surface cards (`#FFFFFF`) with a 2px solid border in a slightly darker gray (`#E5E5E5`).
- **Interactive Depth:** Buttons and active cards use a bottom "border-bottom" of 4px to simulate a physical button. When pressed, the element translates 2px down and the border-bottom shrinks to 2px, providing tactile feedback.

## Shapes

The shape language is consistently rounded to maintain a friendly, non-threatening educational environment. 
- **Standard UI Elements:** Use a `0.5rem` (8px) radius.
- **Interactive Buttons:** Use a `0.75rem` (12px) radius.
- **Badges and Word Registers:** Use full pill-shaped (`rounded-full`) geometry to distinguish them from structural cards.

## Components

### Buttons
Primary buttons feature a heavy 4px bottom shadow of a darker shade of the button's color. Text is always bold and centered.

### Progress Rings & Bars
Used for tracking reading completion. Use `Success Green` for the progress fill and a light gray background track. The stroke should be thick (4px-8px) with rounded caps.

### Cards
Modules and exercise blocks are contained in cards with a white background and a 2px light gray border. They do not use shadows; instead, they use a 2px bottom border for a "flat 3D" effect.

### Word Register Badges
Small, pill-shaped tags used to identify the tone of a text (e.g., *Argot*, *Soutenu*). These use high-saturation background colors with white text to stand out against the serif reading text.

### Syntax Markers
Nouns, Verbs, and Adjectives should be styled with a "highlight" effect—a light 10% opacity background of their respective colors with a 2px solid bottom border of the 100% opacity color. This ensures the text remains the primary focus while the categorization is clear.