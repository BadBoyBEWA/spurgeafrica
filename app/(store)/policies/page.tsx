import Link from "next/link";

export default function PoliciesPage() {
  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Policies</p>
        <h1 className="mt-3 font-serif text-5xl">Shipping, Returns & Cancellations</h1>

        {/* Shipping & Return Policy */}
        <section id="shipping-and-return-policy" className="mt-12">
          <h2 className="font-serif text-3xl text-gold">Shipping & Return Policy</h2>

          <div className="mt-6 space-y-6 text-sm leading-7 text-muted">
            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Delivery Timeline</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><strong className="text-[var(--fg)]">In Stock:</strong> Orders are processed and shipped within 3–7 business days.</li>
                <li><strong className="text-[var(--fg)]">Low Stock:</strong> Items with limited availability ship within 5–10 business days.</li>
                <li><strong className="text-[var(--fg)]">Made to Order:</strong> Bespoke and custom pieces require 2–3 weeks for production before shipping.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Shipping Information</h3>
              <p>
                We offer nationwide delivery across Nigeria and select international routes. Shipping costs are calculated at checkout based on your location and order size. All orders are securely packaged and insured during transit.
              </p>
              <p className="mt-3">
                Once your order is dispatched, you will receive a tracking number via email or SMS. Delivery times are estimates and may be affected by customs clearance for international orders.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Returns</h3>
              <p>
                We accept returns on ready-to-wear items within 14 days of delivery, provided the item is unworn, unwashed, and in its original packaging with all tags attached. Custom and made-to-order pieces are final sale unless there is a manufacturing defect.
              </p>
              <p className="mt-3">
                To initiate a return, please contact us at <strong className="text-[var(--fg)]">08115656501</strong> or email us with your order number and reason for return. Return shipping costs are borne by the customer unless the item is defective or incorrect.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Exchanges</h3>
              <p>
                Exchanges are processed subject to availability. If you wish to exchange an item for a different size or colour, please initiate a return and place a new order. We recommend contacting us first to confirm availability.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation & Refund Policy */}
        <section id="cancellation-and-refund-policy" className="mt-16 border-t hairline pt-12">
          <h2 className="font-serif text-3xl text-gold">Cancellation & Refund Policy</h2>

          <div className="mt-6 space-y-6 text-sm leading-7 text-muted">
            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Cancellation</h3>
              <p>
                Orders for in-stock items may be cancelled within 24 hours of placement for a full refund. After 24 hours, if the order has already been processed or dispatched, cancellation may not be possible.
              </p>
              <p className="mt-3">
                <strong className="text-[var(--fg)]">Made-to-order and custom pieces</strong> cannot be cancelled once production has begun (typically within 48 hours of order confirmation). Please review your order carefully before confirming.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Refunds</h3>
              <p>
                Refunds are processed within 7–10 business days after we receive and inspect the returned item. The refund will be issued to the original payment method used at checkout.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Full refund for items returned in original condition within 14 days.</li>
                <li>Refund excludes original shipping charges unless the return is due to our error.</li>
                <li>Custom and made-to-order pieces are non-refundable unless defective.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Defective or Incorrect Items</h3>
              <p>
                If you receive a defective or incorrect item, please contact us immediately at <strong className="text-[var(--fg)]">08115656501</strong>. We will arrange a pickup, cover return shipping, and issue a full refund or replacement at no additional cost.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--fg)]">Contact Us</h3>
              <p>
                For any questions regarding shipping, returns, cancellations, or refunds, please reach out to us:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Phone: <strong className="text-[var(--fg)]">08115656501</strong></li>
                <li>Address: Eleganza Gardens Estate, Lekki, Lagos</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/contact" className="inline-block bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night transition hover:bg-terracotta hover:text-cream">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
