import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Mathsya",
  description:
    "Read the terms and conditions for using the Mathsya website and services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-primary">
        Terms and Conditions
      </h1>

      <div className="max-w-3xl space-y-6 text-muted-foreground">
        <p>
          Welcome to Mathsya. By accessing or using our website and services,
          you agree to be bound by the following terms and conditions. Please
          read them carefully.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. General Information
          </h2>
          <p>
            This website is operated by Mathsya Fish Trading and Marketing Private Limited, Door No. 18/291-2, Manathala House, Gurudevan Road, Near Viswanatha
Temple, Manathala, Chavakkad, Thrissur, Kerala, India, 680506
. Throughout the site,
            the terms &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer
            to Mathsya.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. Use of the Website
          </h2>
          <p>
            You may use this website for lawful purposes only. You must not use
            this website in any way that may cause damage to the website or
            impair the availability or accessibility of the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Products and Pricing
          </h2>
          <p>
            We strive to display accurate product descriptions and pricing.
            However, prices and availability are subject to change without prior
            notice. We reserve the right to modify or discontinue any product at
            any time.
          </p>
          <p>
            All prices listed on the website are in Indian Rupees (INR) and are
            inclusive of applicable taxes unless stated otherwise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Orders and Delivery
          </h2>
          <p>
            By placing an order, you are making an offer to purchase a product.
            We reserve the right to accept or decline your order for any reason,
            including product availability or errors in pricing.
          </p>
          <p>
            Delivery timelines are estimates and may vary based on location and
            other factors. We will make every effort to deliver your order within
            the estimated timeframe.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            5. Payment
          </h2>
          <p>
            We accept payments through the methods listed on our website. All
            payments must be made in full at the time of placing the order. We
            use secure payment gateways to protect your financial information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            6. Cancellations
          </h2>
          <p>
            Orders may be cancelled before they are dispatched. Once an order
            has been dispatched, it cannot be cancelled. Please contact us as
            soon as possible if you wish to cancel an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            7. Intellectual Property
          </h2>
          <p>
            All content on this website, including text, images, logos, and
            graphics, is the property of Mathsya Fish Trading and Marketing Pvt
            Ltd and is protected by intellectual property laws. You may not
            reproduce, distribute, or use any content without our prior written
            consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Mathsya shall not be liable
            for any indirect, incidental, or consequential damages arising from
            the use of our website or services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            9. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of India. Any disputes arising from these
            terms shall be subject to the exclusive jurisdiction of the courts
            in Thrissur, Kerala.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            10. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these terms and conditions at any
            time. Changes will be effective immediately upon posting on this
            page. Your continued use of the website constitutes acceptance of
            the updated terms.
          </p>
        </section>

        <p className="pt-4 text-sm">
          If you have any questions about these terms, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
