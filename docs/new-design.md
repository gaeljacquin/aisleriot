---
name: Glacier
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bec8ce'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#899298'
  outline-variant: '#3f484e'
  surface-tint: '#7bd1fa'
  primary: '#c5eaff'
  on-primary: '#003547'
  primary-container: '#7dd3fc'
  on-primary-container: '#005b78'
  inverse-primary: '#006686'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#c9e9ff'
  on-tertiary: '#00354a'
  tertiary-container: '#82d2ff'
  on-tertiary-container: '#005a7b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c0e8ff'
  primary-fixed-dim: '#7bd1fa'
  on-primary-fixed: '#001e2b'
  on-primary-fixed-variant: '#004d66'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Lora
    fontSize: 56px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lora
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Lora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is built upon the "Frozen Light" aesthetic—a dark, atmospheric take on glassmorphism that evokes the serene, crystalline depth of glacial ice. It targets high-end technology, creative portfolios, and immersive wellness applications where focus and calm are paramount. 

The visual language balances sharp, high-fidelity clarity with soft, ethereal depth. By utilizing heavy backdrop blurs and subtle chromatic aberration on edge highlights, the UI feels both digital and tactile. The emotional response is one of sophisticated quietude, precision, and futuristic elegance.

## Colors
The palette is centered around a core of "Ice Blue" (#7dd3fc), used sparingly for high-intent actions and critical focus points. The background is a deep, atmospheric "Midnight Navy" (#0f172a), which provides the necessary contrast for translucent layers.

- **Primary:** Ice Blue (#7dd3fc) - Used for primary buttons, active states, and glowing accents.
- **Surface:** Translucent White (rgba(255, 255, 255, 0.05)) - The foundation for glass panels.
- **Stroke:** Frosted Border (rgba(255, 255, 255, 0.12)) - Defines the geometry of glass elements.
- **Overlay:** Radial Blue Glow (rgba(125, 211, 252, 0.08)) - Used for background atmosphere to prevent the dark mode from feeling flat.

## Typography
This design system utilizes a hybrid typographic approach. **Lora** is used for headlines and display text to provide an editorial, sophisticated, and slightly "organic" contrast to the sharp digital environment. Its serifs evoke the precision of etched ice.

**Inter** is the workhorse for all functional elements, body copy, and UI labels. It ensures maximum readability against translucent and blurred backgrounds. 

To maintain the atmospheric feel, headlines should often use a subtle text-shadow or a "glow" effect (0.5px blur) in the primary color at very low opacity to simulate light refracting through crystals.

## Layout & Spacing
The layout follows a fluid-to-fixed transition. A 12-column grid is used for desktop (1200px max-width), while a 4-column grid is preferred for mobile. 

Spacing is generous to emphasize the "Minimalist" roots. Elements are grouped in "Glass Pods" that use dynamic padding (typically 24px or 32px) to allow the background textures and blurs to breathe. Negative space is not just empty; it is part of the atmospheric depth.

## Elevation & Depth
Depth is created through **Backdrop Blurs** (20px to 40px) rather than traditional shadows. 

1.  **Level 0 (Base):** The dark background with subtle radial gradients.
2.  **Level 1 (Panels):** 5% white opacity with 20px blur and a 1px solid border at 10% white opacity.
3.  **Level 2 (Modals/Popovers):** 8% white opacity with 40px blur and a 1.5px border.
4.  **Level 3 (Interactive):** Active elements receive a faint outer glow using the primary ice-blue color (rgba(125, 211, 252, 0.2)) instead of a black shadow.

All layers should utilize `backdrop-filter: blur()` to simulate the look of thick, semi-opaque ice.

## Shapes
Shapes are defined by "Rounded" corners (0.5rem base) to soften the "Frozen" aesthetic, preventing it from feeling too cold or aggressive. Large containers (cards and panels) should utilize `rounded-xl` (1.5rem) to emphasize the fluid nature of the glassmorphism style. Interactive elements like buttons use the base `rounded` (0.5rem) to maintain a sense of structural integrity.

## Components
- **Buttons:** Primary buttons are solid Ice Blue (#7dd3fc) with dark navy text. Secondary buttons are "ghost" glass panels with a subtle primary color border.
- **Glass Cards:** The signature component. Use a semi-transparent background, backdrop blur, and a light-reflecting top-left border stroke to simulate "edge lighting."
- **Inputs:** Fields are dark and recessed (rgba(0, 0, 0, 0.2)) with a 1px frosted border that glows primary blue upon focus.
- **Chips:** Small, pill-shaped glass elements with high-transparency backgrounds and "Inter" uppercase labels.
- **Selection Controls:** Checkboxes and radios use the primary blue for checked states, appearing as small "glowing lights" within the interface.
- **Atmospheric Dividers:** Instead of solid lines, use 1px gradients that fade to transparent at both ends, simulating a crack or light streak in ice.