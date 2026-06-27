# Design System

## Theme & Colors
We use a high-contrast, warm, and appetizing color palette centered around the brand's signature colors:

- **Primary Red**: `oklch(0.48 0.19 24)` (#c00a27) - Used for primary CTAs, active states, and highlights.
- **Secondary Dark Red**: `oklch(0.41 0.16 23)` (#a9001b) - Used for secondary brand accents.
- **Accent Orange**: `oklch(0.72 0.18 69)` (#ff9c00) - Used for warnings, price accents, and star ratings.
- **Ink (Text)**: `oklch(0.15 0.01 24)` (#111111) - Dark primary text.
- **Background**: `oklch(0.98 0.005 24)` (#fafafa) - Warm-neutral off-white.

## Typography
- **Primary Font Family**: 'Montserrat', sans-serif - Clean, geometric, professional.
- **Decorative/Tab Font Family**: 'Sriracha', cursive - Hand-drawn feel, used exclusively for the category menu tabs (scaled to a readable `24px` instead of `30px`).

## Layout & Spacing
- Standard grid system with an 8px base rhythm (padding, margins, gaps: 8px, 16px, 24px, 32px, 48px).
- Main category product list uses a 4-column responsive grid on desktop (`width: calc(25% - 37.5px)` with `margin-right: 50px`).
- Collapses to 2 columns on tablets, and 1 column on mobile screens.

## Components

### 1. Category Menu Tabs
- Horizontal flex layout with centered items.
- Modern SVG vector icons mapped directly to category slugs.
- Custom categories use a fallback food SVG icon.
- Hover state: Accent orange text color, scales icon smoothly.
- Active state: Primary red text color, keeps icon scaled.

### 2. Product Card
- Image wrapper with hidden details overlay on hover.
- Title and Price range at the bottom.
- WooCommerce-compliant variation form:
  - Tabular size selection buttons.
  - Quantity picker with styled plus/minus buttons.
  - "Mua hàng" (Add to cart) button.
