# Bundle Builder

A multi-step security-system bundle builder with a live review panel, built from the provided
Figma design. React 19 + TypeScript + Vite, styled with Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

Other scripts:

```bash
npm run build            # type-check + production build
npm run test              # run the unit/RTL test suite (Vitest)
npm run lint               # ESLint
npm run storybook          # component/story explorer at http://localhost:6006
npm run build-storybook    # static Storybook build
```

No backend is required — all product/pricing data is a local JSON file
(`src/features/bundle-builder/data/bundle.data.json`).

## Architecture

Feature-first, component-driven, following the folder convention: each component owns a
`Component.tsx` (UI only), a colocated `Component.service.ts` (the `useComponent` hook holding
state/handlers) when it has business logic, `.types.ts`, `.stories.tsx`, and an `index.ts` barrel.

```
src/
  common/components/     # cross-feature presentational primitives
    QuantityStepper/
    VariantSelector/
    PriceTag/
  features/bundle-builder/
    data/bundle.data.json       # product/step/pricing data
    bundle-builder.types.ts
    store/useBundleStore.ts     # single Zustand store (+ localStorage persistence)
    utils/bundle.utils.ts       # pure selectors: totals, review sections, step counts
    components/
      BundleBuilder/            # two-column page layout, accordion orchestration
      StepAccordionItem/        # one generic step, driven by data (not 4 near-duplicates)
      ProductCard/
      ReviewPanel/
      ReviewLineItem/
  stories/decorators.tsx        # seeds the real Zustand store for Storybook (never mocked)
```

State lives in one Zustand store: `selections` (`productId -> variantId -> quantity`) and
`activeVariant` (`productId -> currently displayed variant`). Product cards and review-panel rows
both read/write the same store, so a quantity change in either place is reflected everywhere
instantly. `zustand/middleware persist` mirrors state to `localStorage` on every change, which is
what makes "Save my system for later" durable across reloads.

## Key decisions & tradeoffs

- **Tailwind v4 + Base UI, no shadcn CLI scaffolding kept.** `shadcn/ui`'s CLI (the project's
  documented default) was used to bootstrap Tailwind's CSS variables, but its generated Button/
  Accordion/Badge/Separator primitives went unused once the design's actual markup was built —
  they were deleted rather than left as dead code. `@base-ui/react`'s `Accordion` primitive is
  used directly for the step accordion (real accessibility value: roving focus, `aria-expanded`,
  panel semantics) instead of hand-rolling one.
- **Plan is modeled as a single-select, not a quantity.** The review panel shows no stepper next
  to "Cam Unlimited" in the design, which only makes sense if a plan is a radio choice, not a
  count. Selecting a plan sets its quantity to 1 and zeroes its sibling in the same step — reusing
  the same `selections` shape as everything else rather than adding a parallel "selected plan id"
  field.
- **Steps 2–4's expanded content isn't in the provided screenshots** (only the review panel's
  seeded totals are). Sensor/plan/accessory product lists were filled in with plausible Wyze
  products so the step is genuinely interactive, while quantities were seeded to reproduce the
  review panel exactly as shown collapsed.
- **The Figma mock's own numbers aren't internally consistent** (e.g. a card's per-unit price
  doesn't multiply out to the review panel's line total for that product). Rather than replicate
  the inconsistency, the seed data uses its own consistent per-unit prices so totals always
  compute correctly from `unitPrice × quantity`.
- **Product photos are placeholder SVGs**, not real Wyze product photography (`public/products/`).
  They're stand-ins for layout/fidelity purposes only.
- **Financing line ("as low as $X/mo")** is an illustrative `subtotal / 10` estimate — there's no
  real financing calculation to reproduce, and the design doesn't specify one either.
- **No backend.** The take-home explicitly calls this a bonus; a static JSON file is imported
  directly and is trivial to swap for a fetch later.
- **No React Router.** Single page, no navigation boundary — adding a router would be dead weight.
- **No Playwright.** Per the project's own testing philosophy, Playwright is reserved for
  journeys crossing multiple pages/routes/auth boundaries. This app has none of those; the
  Vitest + RTL suite already covers the interactive logic (variant/quantity sync, plan
  single-select, totals recalculation, persistence), and Storybook covers presentational states
  and interaction (`play`) tests for the reusable UI pieces.
- **Checkout** is a local-state confirmation message, per the brief ("a placeholder or a simple
  confirmation is fine") — there's nowhere for it to actually go in this prototype.

## Testing

- `useBundleStore.test.ts` / `bundle.utils.test.ts` — store behavior and pure calculations
  (variant independence, single-select radio logic, totals/savings math).
- `ProductCard.test.tsx` — the variant-bound stepper, the selected-state border, the locked
  required item, single-select plan switching.
- `ReviewPanel.test.tsx` — grouped sections, live total recalculation, save/checkout
  confirmations, no stepper on the plan line.
- Storybook stories cover every component's meaningful states (default/selected, with/without
  badge or variants, locked, single-select, empty cart) with `play` functions for the same
  interactions where that's the more natural layer (per the project's "don't duplicate the same
  assertion across layers" rule).

## What's not finished

- Only desktop + one mobile breakpoint were manually checked in-browser; no cross-browser pass.
- No dark mode (not in the design, not requested).
- Accessibility is broadly there (labeled steppers/radiogroups, `aria-expanded` accordion,
  Storybook's a11y addon enabled) but hasn't had a dedicated audit pass.
