import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for AU Calculators. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 27 March 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p>
            AU Calculators (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
            au-calculators.vercel.app. This Privacy Policy explains how we collect, use, and protect
            information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <p>
            <strong>Calculator inputs:</strong> All calculator inputs (loan amounts, interest rates,
            etc.) are processed entirely in your browser. We do not collect, store, or transmit any
            financial data you enter.
          </p>
          <p>
            <strong>Automatically collected information:</strong> When you visit our site, we may
            collect standard web log information including your IP address, browser type, referring
            page, pages visited, and the date and time of your visit. This information is collected
            via cookies and similar technologies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cookies</h2>
          <p>We use the following types of cookies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential cookies:</strong> Required for basic site functionality, such as
              remembering your cookie consent preference.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how visitors interact with our
              website so we can improve it.
            </li>
            <li>
              <strong>Advertising cookies:</strong> Used by Google AdSense to display relevant
              advertisements. These cookies may track your browsing habits across other websites.
            </li>
          </ul>
          <p>
            You can manage your cookie preferences through your browser settings. Declining cookies
            may affect your experience on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Google AdSense</h2>
          <p>
            We use Google AdSense to display advertisements on our website. Google AdSense uses
            cookies to serve ads based on your prior visits to our website or other websites. Google
            and its partners may use the information collected to show you targeted advertisements.
          </p>
          <p>
            You can opt out of personalised advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              Google Ads Settings
            </a>
            . For more information about how Google uses data, visit{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              Google&apos;s Privacy & Terms
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            privacy practices of these websites. We encourage you to read the privacy policies of
            any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
          <p>
            We take reasonable measures to protect the information collected through our website.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Australian Privacy Principles
          </h2>
          <p>
            We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act
            1988 (Cth). If you have concerns about how we handle your personal information, you may
            contact the Office of the Australian Information Commissioner (OAIC) at{" "}
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              www.oaic.gov.au
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our{" "}
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
