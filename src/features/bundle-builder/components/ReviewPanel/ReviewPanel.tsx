import { Truck } from "lucide-react";
import { PriceTag } from "@/common/components/PriceTag";
import { formatMoney } from "../../utils/bundle.utils";
import { ReviewLineItem } from "../ReviewLineItem";
import { useReviewPanel } from "./ReviewPanel.service";

export function ReviewPanel() {
  const {
    sections,
    totals,
    shipping,
    guarantee,
    isSaved,
    handleSave,
    checkedOut,
    handleCheckout,
  } = useReviewPanel();

  const priceSummary = (
    <>
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
    </>
  );

  return (
    <aside className="flex flex-col gap-6 rounded-2xl bg-review-bg p-6 md:sticky md:top-6 xl:static xl:grid xl:grid-cols-[1fr_360px] xl:items-start">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Review
        </span>
        <h2 className="text-2xl font-bold text-foreground">
          Your security system
        </h2>
        <p className="text-sm text-muted-foreground">
          Review your personalized protection system designed to keep what
          matters most safe.
        </p>

        <hr className="my-3 border-border" />

        {sections.map((section) => (
          <div key={section.category} className="mb-1">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {section.title}
            </h3>
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <ReviewLineItem
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                />
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
        <div className="hidden items-start gap-4 xl:flex">
          <img
            src="/badges/wyze-guarantee-badge.png"
            alt={guarantee.label}
            className="size-[131px] shrink-0"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-foreground">
              {guarantee.heading}
            </h3>
            <p className="text-sm text-muted-foreground">
              {guarantee.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <img
            src="/badges/wyze-guarantee-badge.png"
            alt={guarantee.label}
            className="size-20 shrink-0"
          />
          <div className="flex flex-1 flex-col items-end gap-1">
            {priceSummary}
          </div>
        </div>

        <div className="hidden items-center justify-between xl:flex">
          {priceSummary}
        </div>

        {totals.savings > 0 && (
          <p className="text-center text-sm font-semibold text-success">
            Congrats! You&apos;re saving {formatMoney(totals.savings)} on your
            security bundle!
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-1 rounded-full bg-brand py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {checkedOut ? "Order placed — thank you! 🎉" : "Checkout"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="text-center text-sm font-medium text-muted-foreground underline underline-offset-2"
        >
          {isSaved ? "Saved for later ✓" : "Save my system for later"}
        </button>
      </div>
    </aside>
  );
}
