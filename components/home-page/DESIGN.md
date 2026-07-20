---
name: Midnight Angler
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#dac2b2'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#a28d7e'
  outline-variant: '#544338'
  surface-tint: '#ffb782'
  primary: '#ffc49a'
  on-primary: '#4f2500'
  primary-container: '#ff9d4d'
  on-primary-container: '#6f3700'
  inverse-primary: '#934b00'
  secondary: '#c0c6db'
  on-secondary: '#293041'
  secondary-container: '#42495a'
  on-secondary-container: '#b2b8cd'
  tertiary: '#c5d1e8'
  on-tertiary: '#263143'
  tertiary-container: '#aab5cc'
  on-tertiary-container: '#3c475a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#ffb782'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#703800'
  secondary-fixed: '#dce2f8'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#151b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '900'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  section-padding: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system embodies a premium, high-octane outdoor aesthetic tailored for the serious angler. It balances the ruggedness of the sport with a sleek, technical sophistication. The target audience values durability and precision, necessitating a UI that feels "engineered" yet accessible.

The visual style is a blend of **Minimalism** and **Modern Corporate**, utilizing heavy contrast and deep atmospheric depths. By pairing a dark, nocturnal canvas with vibrant, high-energy accents, the system evokes a sense of early-morning anticipation and elite performance.

## Colors
The palette is anchored by a deep navy background that provides a sophisticated alternative to pure black, enhancing the "premium" feel. 

- **Primary (Sunset Orange):** Reserved for the most important actions, branding, and highlighting key value propositions. It provides maximum contrast against the dark background.
- **Secondary (Midnight Navy):** The core background color, ensuring a low-strain reading environment.
- **Tertiary (Slate Surface):** Used for elevated containers, input fields, and hover states to create subtle depth.
- **Neutral (Arctic White/Slate):** High-clarity typography for maximum legibility.

## Typography
The typography system uses **Montserrat** across all levels to maintain a cohesive, geometric, and bold personality. 

Headlines utilize "Black" and "ExtraBold" weights with tight letter spacing to create high-impact, editorial-style layouts. Body copy remains clean and airy, utilizing regular weights to ensure readability against dark backgrounds. Navigation and labels are often uppercase with slight tracking (letter-spacing) to emphasize the technical and structured nature of the brand.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a generous vertical rhythm. 

- **Desktop:** 12-column grid with a 1280px max-width container. Section padding is aggressive (80px+) to allow the high-quality imagery and bold typography room to breathe.
- **Mobile:** 4-column grid with 16px side margins. Typography scales down significantly, and buttons transition to full-width "blocks" for easier thumb interaction.
- **Spacing Logic:** Uses a base 8px scale. Layouts should prioritize large, immersive hero sections followed by structured product or category grids.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Semi-Transparent Overlays** rather than heavy shadows.

- **Surface Levels:** The primary background is the lowest level. Cards and dropdowns use a slightly lighter slate tint (`#1e293b`) or a semi-transparent blur (Backdrop Filter: 12px) to appear "closer" to the user.
- **Outlines:** Ghost borders (1px solid white at 10-15% opacity) are used to define interactive areas without breaking the dark aesthetic.
- **Header:** The navigation bar uses a high-blur glassmorphism effect to maintain context of the background imagery while ensuring text legibility.

## Shapes
The design system uses a **Rounded** shape language to soften the aggressive high-contrast color palette and bold typography. 

Standard components (buttons, inputs) utilize a 0.5rem (8px) radius. Larger containers or "pill-style" elements like floating chat buttons or specific chips may use 1rem or full-pill rounding to distinguish them as secondary interactive layers.

## Components
- **Buttons:** Primary buttons are solid Orange with dark text. Secondary buttons are "Ghost" style (transparent with a thin border and white text). All buttons include a subtle hover transition that increases opacity or shifts the background tone.
- **Inputs:** Search and form fields use a dark translucent background with a persistent 1px border. Focused states should highlight the border in the primary Orange.
- **Dropdowns:** Menus use a "Surface-over-Blur" approach—deep navy backgrounds with a subtle border and 100% width hover states for menu items.
- **Cards:** Product cards are borderless with high-quality photography. Text is placed directly below the image or on a subtle gradient overlay if placed inside.
- **Chips/Labels:** Small, uppercase badges with high letter-spacing used for categories like "New Arrivals" or "Sale."