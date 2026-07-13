# Bundle Builder

Security-system bundle builder from the take-home Figma: a 4-step accordion (cameras, plan,
sensors, extras) with a live review panel next to it. React 19, TypeScript, Vite, Tailwind v4.

## Running it

```bash
npm install
npm run dev
```

`http://localhost:5173`. No backend — the catalog is a local JSON file at
`src/features/bundle-builder/data/bundle.data.json`, imported directly.

```bash
npm run build            # tsc -b + vite build
npm run test              # vitest
npm run lint               # eslint
npm run storybook          # http://localhost:6006
npm run build-storybook
```

## Structure

```
src/
  common/components/          # PriceTag, QuantityStepper, VariantSelector
  features/bundle-builder/
    data/bundle.data.json
    bundle-builder.types.ts
    store/useBundleStore.ts
    utils/bundle.utils.ts
    components/
      BundleBuilder/          # page layout + accordion wiring
      StepAccordionItem/      # one component for all 4 steps, driven by data
      ProductCard/
      ReviewPanel/
      ReviewLineItem/
  stories/decorators.tsx
```

Each component folder is `Component.tsx` (markup only) + `Component.service.ts` (the `useX` hook —
store access, handlers) when there's any logic, plus `.types.ts` and `.stories.tsx`.

## How it works

One Zustand store, two pieces of real state:

- `selections`: `productId -> variantId -> quantity`
- `activeVariant`: `productId -> which variant is currently shown on the card`

Everything else (names, prices, images, steps) is the static JSON, never touched by the store.
`ProductCard` and `ReviewLineItem` both call the same `setQuantity`/`setActiveVariant`, so they're
never "synced" — they're just two renders of the same state. Switching a variant only changes
`activeVariant`; it never touches `selections`, which is why adding 2 Red then switching to Blue
shows 0 on the card but still shows Red ×2 in the review panel.

Plans reuse the exact same shape instead of a separate "selected plan" concept — a plan product
just has `selectionMode: 'single'`, and `setQuantity` zeroes its siblings in the same step when
you select one. That's also why the plan row in the review panel has no stepper: it's a
`billingPeriod !== undefined` check in `ReviewLineItem`, not a different data path.

Persistence is `zustand/middleware`'s `persist`, mirroring the store to `localStorage` on every
change. "Save my system for later" is mostly a confirmation UI — the state was already being saved
continuously; the button just gives the user something to click and remember.

The accordion is `@base-ui/react/accordion`, controlled from `BundleBuilder` via a single
`openStepId` in the store. One open step, no manual close-the-others logic — that's just how a
controlled single-value accordion root behaves.

Totals and grouped review sections come from two pure functions in `bundle.utils.ts`
(`getReviewSections`, `getTotals`) that take the store's `selections` and the static data and
return plain objects — no React in there, which is why they're the most heavily unit-tested part
of the app.

## Data

Prices in the seed data don't map onto Figma's actual numbers 1:1 — a couple of the mock's own
numbers didn't multiply out consistently (unit price × qty ≠ the shown line total), so the JSON
uses its own internally consistent prices instead of chasing an inconsistency. Product images are
placeholder SVGs, not real photos. The financing line ("as low as $X/mo") is just `subtotal / 10`,
there's no real calculation behind it. Steps 2–4's product lists aren't in the provided
screenshots (only their collapsed totals are), so those are filled in with plausible products,
seeded to match the review panel exactly as shown.

## Testing

- `bundle.utils.test.ts`, `useBundleStore.test.ts` — pure calculations and store transitions.
- `ProductCard.test.tsx` — variant-bound stepper, selected state, locked/required item, plan
  single-select.
- `ReviewPanel.test.tsx` — grouped sections, totals recalculating, save/checkout confirmations.
- Storybook stories cover each component's states (selected/unselected, no badge/variants, locked,
  empty cart), with `play` functions where an interaction fits better there than in RTL.

No Playwright, no React Router — single page, nothing crossing routes or auth, so neither pulled
its weight.

## Known gaps

- Only checked in one desktop and one mobile viewport by hand, no real cross-browser pass.
- `PriceTag` (in `common/`) currently imports `formatMoney` from the bundle-builder feature's
  utils — that's backwards for a component meant to be feature-agnostic, should move to a
  shared util.
- `StepAccordionItem` and `ReviewPanel` both subscribe to the whole `selections` object, so every
  quantity change re-renders all four steps and the panel, not just the one that changed. Fine at
  this catalog size, wouldn't scale gracefully.
- Quantity stepper's number is `aria-hidden` with nothing announcing the new value to screen
  readers — the one real accessibility gap I know about.
- No schema validation on the JSON import (`as BundleData`, unchecked).
- No minimum-selection guard on checkout — you can check out with an empty cart.
