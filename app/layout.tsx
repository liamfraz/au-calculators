import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import CookieConsent from "./components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AU Calculators — Free Financial Tools for Australians",
    template: "%s | AU Calculators",
  },
  description:
    "Free Australian financial calculators including mortgage repayment, stamp duty, tax, and more. Built for Australians, by Australians.",
  keywords: [
    "australian calculator",
    "financial calculator australia",
    "mortgage calculator australia",
    "home loan calculator",
  ],
  metadataBase: new URL("https://au-calculators.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {adSenseId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-800">AU Calculators</span>
              <span className="hidden sm:inline text-sm text-gray-500">
                Free Financial Tools for Australians
              </span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors">
                Home
              </Link>
              <Link
                href="/calculators/mortgage-repayment"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Mortgage
              </Link>
              <Link
                href="/mortgage-offset-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Offset
              </Link>
              <Link
                href="/car-loan-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Car Loan
              </Link>
              <Link
                href="/calculators/super"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Super
              </Link>
              <Link
                href="/calculators/energy-bill"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Energy
              </Link>
              <Link
                href="/calculators/hecs-help"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                HECS
              </Link>
              <Link
                href="/stamp-duty-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Stamp Duty
              </Link>
              <Link
                href="/calculators/rental-yield"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Rental Yield
              </Link>
              <Link
                href="/calculators/land-tax"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Land Tax
              </Link>
              <Link
                href="/cgt-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                CGT
              </Link>
              <Link
                href="/calculators/gst"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                GST
              </Link>
              <Link
                href="/calculators/compound-interest"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Savings
              </Link>
              <Link
                href="/tax-withholding-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Tax
              </Link>
              <Link
                href="/bmi-calculator"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                BMI
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} AU Calculators. Free financial tools for
                  Australians.
                </p>
                <nav className="flex gap-4 text-sm">
                  <Link
                    href="/about"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    Terms of Use
                  </Link>
                </nav>
              </div>
              <p className="text-xs text-gray-400 text-center sm:text-left">
                Disclaimer: These calculators provide estimates only. Consult a qualified financial
                adviser before making financial decisions.
              </p>
            </div>
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
