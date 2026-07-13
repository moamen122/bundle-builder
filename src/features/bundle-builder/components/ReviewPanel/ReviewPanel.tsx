import { Truck } from 'lucide-react';
import { PriceTag } from '@/common/components/PriceTag';
import { formatMoney } from '../../utils/bundle.utils';
import { ReviewLineItem } from '../ReviewLineItem';
import { useReviewPanel } from './ReviewPanel.service';

export function ReviewPanel() {
  const { sections, totals, shipping, guarantee, isSaved, handleSave, checkedOut, handleCheckout } =
    useReviewPanel();

  return (
    <aside className="flex flex-col gap-6 rounded-2xl bg-review-bg p-6 md:grid md:grid-cols-[1fr_300px] md:items-start">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Review
        </span>
        <h2 className="text-2xl font-bold text-foreground">Your security system</h2>
        <p className="text-sm text-muted-foreground">
          Review your personalized protection system designed to keep what matters most safe.
        </p>

        <hr className="my-3 border-border" />

        {sections.map((section) => (
          <div key={section.category} className="mb-1">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {section.title}
            </h3>
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <ReviewLineItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>
          </div>
        ))}

        <hr className="my-2 border-border" />

        <div className="flex items-center justify-between py-2">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Truck className="size-5 text-success" aria-hidden="true" />
            {shipping.label}
          </span>
          <PriceTag price={shipping.price} compareAt={shipping.compareAt} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-dashed border-white bg-brand p-2 text-center text-[10px] leading-tight font-bold text-white md:size-28 md:text-xs">
            {guarantee.label}
          </div>
          <div className="hidden flex-col gap-1 md:flex">
            <h3 className="text-lg font-bold text-foreground">{guarantee.heading}</h3>
            <p className="text-sm text-muted-foreground">{guarantee.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:justify-between">
          <span className="rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">
            as low as {formatMoney(totals.financingEstimate)}/mo
          </span>
          <div className="flex flex-col items-end">
            {totals.savings > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatMoney(totals.compareAtSubtotal)}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {formatMoney(totals.subtotal)}
            </span>
          </div>
        </div>

        {totals.savings > 0 && (
          <p className="text-center text-sm font-semibold text-success">
            Congrats! You&apos;re saving {formatMoney(totals.savings)} on your security bundle!
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-1 rounded-full bg-brand py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {checkedOut ? 'Order placed — thank you! 🎉' : 'Checkout'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="text-center text-sm font-medium text-muted-foreground underline underline-offset-2"
        >
          {isSaved ? 'Saved for later ✓' : 'Save my system for later'}
        </button>
      </div>
    </aside>
  );
}
