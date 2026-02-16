import { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Mathsya",
  description:
    "Get in touch with Mathsya Fish Trading and Marketing Pvt Ltd. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-primary">
        Contact Us
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Have a question, feedback, or need help with your order? We&apos;d
            love to hear from you. Reach out to us using any of the methods
            below.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Address</h3>
                <p className="text-sm text-muted-foreground">
                  Mathsya Fish Trading and Marketing Private Limited
                  <br />
                  Door No. 18/291-2, Near Viswanatha Temple,
                  <br />
                  Manathala, Chavakkad, Thrissur
                  <br />
                  Kerala, India, 680506
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Phone</h3>
                <p className="text-sm text-muted-foreground">+91 7071 705705<br/>+91 7071 460460</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">+91 91886 76454</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">
                  mathsyafishes@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Business Hours
            </h3>
            <p className="text-sm text-muted-foreground">
              Monday – Saturday: 8:00 AM – 8:00 PM
              <br />
              Sunday: 8:00 AM – 1:00 PM
            </p>
          </div>
        </div>

        {/* Contact Form 
        <div className="rounded-lg border border-border bg-muted/20 p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>
        </div>
        */}
      </div>
    </div>
  );
}
