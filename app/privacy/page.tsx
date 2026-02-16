import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mathsya",
  description:
    "Learn how Mathsya collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-primary">
        Privacy Policy
      </h1>

      <div className="max-w-3xl space-y-6 text-muted-foreground">
        <p>
          At Mathsya, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we
          collect, use, and safeguard your data when you use our website and
          services.
        </p>
        <p className="font-bold text-sm text-muted-foreground">Last Updated: 15th February 2026</p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-foreground">Personal Information:</strong>{" "}
              Name, email address, phone number, and delivery address when you
              create an account or place an order.
            </li>
            <li>
              <strong className="text-foreground">Payment Information:</strong>{" "}
              Payment details processed securely through our payment gateway
              partners. We do not store your card details on our servers.
            </li>
            <li>
              <strong className="text-foreground">Usage Data:</strong> Browser
              type, IP address, pages visited, and other analytics data to
              improve our services.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Process and deliver your orders.</li>
            <li>
              Communicate with you about your orders, updates, and promotions.
            </li>
            <li>Improve our website, products, and customer experience.</li>
            <li>Comply with legal obligations and resolve disputes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Information Sharing
          </h2>
          <p>
            We do not sell or rent your personal information to third parties.
            We may share your information with:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong className="text-foreground">Delivery Partners:</strong> To
              fulfil and deliver your orders.
            </li>
            <li>
              <strong className="text-foreground">Payment Processors:</strong>{" "}
              To securely process your payments.
            </li>
            <li>
              <strong className="text-foreground">Legal Authorities:</strong>{" "}
              When required by law or to protect our rights.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Data Security
          </h2>
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal information against unauthorised access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            5. Cookies
          </h2>
          <p>
            Our website may use cookies and similar technologies to enhance your
            browsing experience. You can manage your cookie preferences through
            your browser settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            6. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Access and review the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>
              Request deletion of your personal data, subject to legal
              requirements.
            </li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            7. Third-Party Links
          </h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites. We
            encourage you to review their privacy policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated effective date. Your
            continued use of our services constitutes acceptance of the revised
            policy.
          </p>
        </section>

        <p className="pt-4 text-sm">
          If you have any questions about this Privacy Policy, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
