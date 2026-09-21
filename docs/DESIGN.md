# Design System — Nursery Frontend

## Theme

### Colors
- **Primary**: Green (plant/nursery theme) — used for CTAs, links, accents
- **Background**: Light mode with subtle warm tones
- **Text**: Dark gray for readability
- **Muted**: Subtle gray for secondary text, borders, dividers
- **Destructive**: Red for errors and delete actions

### Typography
- **Display Font**: `Plus Jakarta Sans` (headings, hero text) — weights: 600, 700, 800
- **Body Font**: `Inter` (body text, UI elements) — weights: 400, 500, 600, 700
- Loaded via Google Fonts (preconnected for performance)

### Spacing
- Consistent spacing scale via Tailwind (`px-6`, `py-14`, `gap-4`, etc.)
- Max content width: `max-w-5xl` for auth pages, responsive grid for product pages
- Mobile-first padding with responsive breakpoints

## Component Library

### Base UI (shadcn/ui)
All primitives in `src/components/ui/`:
- Button, Input, Label, Select
- Dialog, Popover, Dropdown Menu
- Accordion, Tabs, Toggle
- Toast (Sonner), Tooltip
- Scroll Area, Separator
- And more Radix-based primitives

### Domain Components
| Directory | Purpose |
|---|---|
| `home/` | Hero banners, featured sections, recommendations |
| `product/` | Product cards, galleries, variant selectors |
| `category/` | Category grid, tree navigation |
| `commerce/` | Cart drawer, checkout forms, payment UI |
| `layout/` | Header, footer, mobile nav, breadcrumbs |
| `shared/` | Reusable pieces (ratings, badges, price display) |
| `ai-elements/` | Chat assistant interface |

## Animations
- **Motion** (Framer Motion) for page transitions and micro-interactions
- Smooth hover effects on product cards
- Entrance animations on scroll
- Loading skeletons for async content

## Responsive Breakpoints
- Mobile: default (< 640px)
- Tablet: `sm` (640px+)
- Desktop: `md` (768px+), `lg` (1024px+), `xl` (1280px+)

## Icons
- **Lucide React** — consistent line icon set
- Used throughout navigation, buttons, and UI indicators

## Toasts / Notifications
- **Sonner** for toast notifications
- Success: green, auto-dismiss
- Error: red, with API error message
- Used for auth feedback, cart actions, order status
