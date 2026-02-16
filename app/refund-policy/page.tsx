import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Mathsya",
  description:
    "Read about Mathsya's refund and return policy for seafood orders.",
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-primary">
        Refund Policy
      </h1>

      <div className="max-w-3xl space-y-6 text-muted-foreground">
        <p>
          At Mathsya, we are committed to delivering the freshest seafood to
          your doorstep. We understand that issues may occasionally arise, and
          we want to ensure your satisfaction with every order.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. Eligibility for Refund
          </h2>
          <p>You may be eligible for a refund or replacement if:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>The product delivered is damaged, spoiled, or not fresh.</li>
            <li>
              You received an incorrect item that does not match your order.
            </li>
            <li>
              There is a significant quality issue with the product received.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. How to Request a Refund
          </h2>
          <p>
            To request a refund, please contact our support team within{" "}
            <strong className="text-foreground">24 hours</strong> of receiving
            your order. You can reach us via:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Email:{" "}
              <a
                href="mailto:mathsyafishes@gmail.com"
                className="text-primary hover:underline"
              >
                mathsyafishes@gmail.com
              </a>
            </li>
            <li>Customer Care: +91 7071 705705, +91 7071 460460</li>
            <li>Whatsapp Support: +91 9188676454</li>
            <li>
              Our{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>{" "}
              page
            </li>
          </ul>
          <p>
            Please include your order number, a description of the issue, and
            photographs of the product (if applicable) to help us process your
            request quickly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Refund Process
          </h2>
          <p>
            Once we receive your refund request, our team will review it within{" "}
            <strong className="text-foreground">1–2 business days</strong>.
            If approved, the refund will be processed as follows:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-foreground">Online payments:</strong>{" "}
              Refund will be credited to the original payment method within 5–7
              business days.
            </li>
            <li>
              <strong className="text-foreground">
                Cash on Delivery (COD):
              </strong>{" "}
              Refund will be provided via bank transfer or store credit.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Non-Refundable Cases
          </h2>
          <p>Refunds will not be provided in the following cases:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Change of mind after the order has been delivered.</li>
            <li>
              Improper storage of the product after delivery leading to
              spoilage.
            </li>
            <li>Refund request made after 24 hours of delivery.</li>
            <li>Minor variations in size, weight, or appearance of seafood.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            5. Replacements
          </h2>
          <p>
            In some cases, we may offer a replacement instead of a refund.
            Replacements are subject to product availability and will be
            delivered as soon as possible.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            6. Cancellations
          </h2>
          <p>
            Orders can be cancelled before dispatch for a full refund. Once an
            order has been dispatched, it cannot be cancelled. Please contact us
            immediately if you wish to cancel your order.
          </p>
        </section>

        <p className="pt-4 text-sm">
          For any questions regarding our refund policy, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
