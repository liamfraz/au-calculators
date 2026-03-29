import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About AU Calculators — free, accurate financial tools built for Australians. No sign-up, no data collection.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About AU Calculators</h1>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
          <p>
            AU Calculators provides free, accurate financial tools designed specifically for
            Australian conditions — using Australian tax rates, regulations, and financial
            conventions. No sign-up required, no data stored.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Why We Built This</h2>
          <p>
            Most online financial calculators are built for the US or UK market. Australian mortgage
            structures, stamp duty rules, superannuation, and tax brackets are different. We built AU
            Calculators so Australians can get accurate estimates without needing to adjust for
            overseas defaults.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Privacy</h2>
          <p>
            All calculations happen in your browser. We never collect, store, or transmit the
            financial data you enter into our calculators. Your numbers stay on your device. Read our
            full{" "}
            <Link href="/privacy" className="text-blue-700 underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Disclaimer</h2>
          <p>
            The calculators on this website provide estimates only and do not constitute financial
            advice. Tax rates, government fees, and lending criteria change regularly. Always consult
            a qualified financial adviser before making financial decisions. See our{" "}
            <Link href="/terms" className="text-blue-700 underline">
              Terms of Use
            </Link>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p>
            Have a question, suggestion, or found a bug? Visit our{" "}
            <Link href="/contact" className="text-blue-700 underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
