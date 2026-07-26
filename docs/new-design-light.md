---
name: Glacier Light
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#516072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1f7'
  on-secondary-container: '#556477'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
This design system is a high-end, light-mode adaptation of a crystalline aesthetic. It evokes the feeling of "Arctic Morning"—crisp, bright, and expansive. The target audience values precision, luxury, and clarity.

The style is a refined **Glassmorphism** mixed with **Minimalism**. It relies on high-transparency layers, subtle background blurs, and "frosted" surfaces to create depth without visual clutter. The emotional response is one of calm professionalism and premium quality, achieved through a restricted cool-toned palette and generous whitespace.

## Colors
The palette is rooted in an off-white, cool-grey foundation to maintain a premium feel without the harshness of pure white. 

- **Primary:** A deepened Ice Blue (#0284c7). Note that the original #7dd3fc is used for accents and decorative fills, but the primary action color is darkened to ensure AA accessibility against light glass surfaces.
- **Surface:** Translucent whites with a 60-80% opacity and a high-refraction backdrop blur.
- **Accents:** Soft silvers and cool slate greys provide the structural "bones" of the UI.
- **Background:** A soft, desaturated blue-grey (#f1f5f9) that provides enough contrast for white glass cards to "pop."

## Typography
The system uses **Literata** (as a high-quality alternative to Lora) for headlines to provide a literary, premium authority. **Inter** handles all functional and body text for maximum legibility.

Weights are slightly increased for the light mode environment; body text uses a "Regular" weight (400) but transitions to "Medium" (500) for smaller labels to prevent "washing out" against translucent backgrounds. Headlines use a tighter letter-spacing to maintain a sophisticated, editorial appearance.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop (12 columns, 1200px max-width) to preserve the "boutique" feel. On mobile, it transitions to a fluid 4-column system.

Spacing is generous, utilizing an 8px rhythmic scale. Components are given significant "breathing room" (internal padding of 24px+) to reinforce the minimalist aesthetic. Margins are intentionally wide to center the focus on the crystalline glass containers.

## Elevation & Depth
Depth is communicated through **Glassmorphism** rather than traditional heavy shadows.

1.  **The Base:** The off-white background (#f1f5f9).
2.  **The Surface:** White containers at 70% opacity with a `backdrop-filter: blur(20px)`.
3.  **The Edge:** A 1px solid border using a very light silver (#e2e8f0) to define the shape.
4.  **The Shadow:** "Ambient" shadows are used sparingly—only for the highest-level elements (modals). These are ultra-diffused (40px+ blur), low opacity (5%), and tinted with the primary blue color.

## Shapes
The shape language is "Rounded." This softens the clinical nature of the cool color palette. 

Containers use a 0.5rem (8px) base radius, but large cards and primary buttons should scale up to `rounded-lg` (16px) to emphasize the tactile, premium nature of the interface. Buttons never use sharp corners, ensuring they feel approachable.

## Components

### Cards
Cards are the hero of this design system.
- **Face:** Semi-transparent white background with a subtle inner-glow effect on the top edge. Pips and icons use high-contrast Slate 800 (#1e293b).
- **Back:** A light version of the "Glacier" pattern—using #e0f2fe (light blue) and white in a low-contrast geometric generative pattern.

### Buttons
- **Primary:** Solid #0284c7 with white text. No gradient, just a slight 1px top highlight.
- **Secondary/Ghost:** Transparent background with a 1px border of #cbd5e1. Text in #475569.

### Input Fields
Inputs should look like "carved" glass. A slightly darker background than the card surface (#f8fafc) with an inner shadow to create a "recessed" feel.

### Chips & Tags
Small, highly rounded (pill-shaped) elements. Use #f1f5f9 backgrounds with #0284c7 text to indicate selection or category.

### Navigation
The navigation bar should be a "Sticky Glass" element at the top of the viewport, using a high blur value (30px) to gracefully tint as content scrolls beneath it.