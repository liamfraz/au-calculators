import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for AU Calculators. Understand the conditions for using our free Australian financial calculators.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 27 March 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AU Calculators (au-calculators.vercel.app), you accept and agree
            to be bound by these Terms of Use. If you do not agree, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Purpose of the Website</h2>
          <p>
            AU Calculators provides free financial calculation tools designed for Australian
            conditions. These tools are intended for informational and educational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. No Financial Advice</h2>
          <p>
            The calculators and information on this website do not constitute financial, tax, legal,
            or investment advice. Results are estimates only and may not reflect your actual
            financial situation. Always consult a qualified financial adviser, accountant, or legal
            professional before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Accuracy of Results</h2>
          <p>
            While we strive to ensure our calculators are accurate, we make no warranties or
            guarantees regarding the accuracy, completeness, or reliability of any calculations or
            information provided. Tax rates, government fees, and financial regulations change
            frequently — our calculators may not always reflect the most current figures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Australian law, AU Calculators and its operators shall
            not be liable for any direct, indirect, incidental, consequential, or punitive damages
            arising from your use of this website, including but not limited to financial losses
            based on calculator results.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and software, is the
            property of AU Calculators or its licensors and is protected by Australian and
            international copyright laws. You may not reproduce, distribute, or create derivative
            works without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Advertising</h2>
          <p>
            This website displays advertisements provided by third-party advertising networks,
            including Google AdSense. We are not responsible for the content of third-party
            advertisements or the products and services they promote. Clicking on an advertisement
            may take you to a third-party website governed by its own terms and privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Website Availability</h2>
          <p>
            We do not guarantee that the website will be available at all times. We may suspend,
            withdraw, or restrict access to the website without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Governing Law</h2>
          <p>
            These Terms of Use are governed by and construed in accordance with the laws of the
            Commonwealth of Australia. Any disputes shall be subject to the exclusive jurisdiction of
            the courts of Australia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be posted on
            this page with an updated revision date. Continued use of the website after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
          <p>
            If you have questions about these Terms of Use, please contact us via our{" "}
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
