---
name: TackleShop Admin
colors:
  surface: '#0a1420'
  surface-dim: '#0a1420'
  surface-bright: '#303a47'
  surface-container-lowest: '#050f1a'
  surface-container-low: '#121c28'
  surface-container: '#16202c'
  surface-container-high: '#212b37'
  surface-container-highest: '#2c3542'
  on-surface: '#d9e3f4'
  on-surface-variant: '#d9c2b3'
  inverse-surface: '#d9e3f4'
  inverse-on-surface: '#27313e'
  outline: '#a18d7f'
  outline-variant: '#534438'
  surface-tint: '#ffb77c'
  primary: '#ffb77c'
  on-primary: '#4d2600'
  primary-container: '#e89347'
  on-primary-container: '#5e3000'
  inverse-primary: '#904d00'
  secondary: '#efbd8a'
  on-secondary: '#472a03'
  secondary-container: '#614017'
  on-secondary-container: '#dcac7a'
  tertiary: '#c6c7c6'
  on-tertiary: '#2f3130'
  tertiary-container: '#a6a7a6'
  on-tertiary-container: '#3b3d3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77c'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#efbd8a'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#614017'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c7c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#0a1420'
  on-background: '#d9e3f4'
  surface-variant: '#2c3542'
typography:
  headline-xl:
    fontFamily: Work Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Work Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Work Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 32px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  grid-columns: '12'
---

## Brand & Style
The design system is crafted for a premium, high-performance administrative environment. It balances the rugged nature of outdoor equipment with the sophisticated precision of modern data analytics. The aesthetic is rooted in **Dark Glassmorphism**, utilizing deep navy tones to reduce eye strain during extended sessions while employing vibrant amber accents to draw focus to critical actions and key performance indicators.

The target audience consists of professional retailers and inventory managers who require a high-density information display that feels organized and luxurious rather than cluttered. The emotional response is one of "command and control"—a reliable, high-tech cockpit for business operations.

## Colors
This palette is built on a foundation of deep, nocturnal navies to create a sense of infinite depth.
- **Primary (#E89347):** A warm, high-visibility amber used for primary calls-to-action, active states, and critical data points.
- **Secondary (#835D32):** A muted, earthy brown used for secondary information and less urgent interactive elements, providing a natural bridge between the navy and amber.
- **Backgrounds:** The primary background uses a deep navy (#131D29) for maximum contrast with light text. Panels and cards use a slightly distinct navy (#111A2D) to create subtle layering.
- **Typography:** Headlines and primary content use the crisp off-white (#FAFAF9) for maximum legibility, while secondary labels utilize the muted brown.

## Typography
The typographic hierarchy uses a dual-font strategy to differentiate between structural navigation and functional data.
- **Headlines:** Set in **Work Sans** with Bold and ExtraBold weights. This provides a strong, industrial character that feels modern and authoritative.
- **Body & Labels:** Set in **Inter** for its exceptional readability in data-heavy environments. The neutral, systematic nature of Inter ensures that complex tables and forms remain legible even at smaller sizes.
- **Data Display:** For numerical values in KPIs, use the Work Sans ExtraBold weight to emphasize business performance metrics.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop, transitioning to a single-column stack for mobile devices. 
- **Rhythm:** A base-8 spacing system is used to maintain vertical rhythm.
- **Dashboard Density:** For data-heavy views, use "Compact Mode" with 12px padding in tables. For general pages, use "Standard Mode" with 24px padding to allow the glassmorphic elements "room to breathe."
- **Safe Areas:** Sidebars are fixed at 280px on desktop, while the main content area expands fluidly.

## Elevation & Depth
Depth in the design system is achieved through **Tonal Layering** and **Backdrop Blurs** rather than traditional drop shadows.
- **Base Layer:** The deepest navy (#131D29).
- **Surface Layer (Cards/Panels):** Uses the lighter navy (#111A2D) with a 60% opacity and a 20px backdrop blur to create the glassmorphic effect.
- **Borders:** Every glassmorphic surface must have a 1px solid border using the specified Slate-Blue Gray (oklch 37.3%). This border acts as the "rim light," defining the edge of the panel against the dark background.
- **Interaction Depth:** On hover, cards should increase in opacity (to 80%) rather than moving or casting a shadow, maintaining a flat but translucent feel.

## Shapes
The shape language is purposefully soft to contrast with the technical nature of the dashboard.
- **Primary Surfaces:** All main dashboard cards and panels use `rounded-2xl` (1.5rem) to evoke a premium, handheld-device feel.
- **Interactive Elements:** Buttons and input fields use `rounded-lg` (1rem) for a cohesive but slightly more precise appearance.
- **Status Indicators:** Small tags and chips should use a fully pill-shaped radius to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons use the Amber (#E89347) background with dark navy text for maximum contrast. Secondary buttons are "ghost" style with the Slate-Blue Gray border.
- **Inputs:** Form fields are semi-transparent with a subtle border. On focus, the border transitions to Amber with a very soft outer glow (0px 0px 8px rgba(232, 147, 71, 0.3)).
- **Data Tables:** Row separators use the Slate-Blue Gray border at 50% opacity. Headers are styled with `label-md` using the Muted Brown color.
- **KPI Cards:** Display a large Work Sans headline for the metric, a secondary Inter label for the title, and a small pill-shaped trend indicator (green for up, red for down).
- **Glass Panels:** All containers must maintain the backdrop blur and subtle border to ensure the premium glassmorphic style is consistent throughout the application.