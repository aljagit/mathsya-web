import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-primary">
                Mathsya
              </span>
            </Link>
            <p className="text-xs text-muted-foreground text-center md:text-left">
              Mathsya Fish Trading and Marketing Private Limited<br/>Door No. 18/291-2, Near Viswanatha Temple,<br/>Manathala, Chavakkad, Thrissur<br/>Kerala, India, 680506
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Contact Us
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/refund-policy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Refund Policy
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mathsya Fish Trading and Marketing Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
