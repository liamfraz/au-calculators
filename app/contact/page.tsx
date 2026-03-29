import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact AU Calculators — get in touch with questions, suggestions, or feedback about our Australian financial calculators.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <p>
          Have a question about one of our calculators? Found a bug? Want to suggest a new feature?
          We&apos;d love to hear from you.
        </p>

        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-900">Email: </span>
              <a href="mailto:contact@aucalculators.com.au" className="text-blue-700 underline">
                contact@aucalculators.com.au
              </a>
            </div>
            <p className="text-gray-500 text-xs">
              We aim to respond to all enquiries within 2 business days.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Common Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Is this site free to use?</h3>
              <p>
                Yes. All calculators on AU Calculators are completely free. We are supported by
                advertising.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Do you store my financial data?</h3>
              <p>
                No. All calculations happen in your browser. We never collect, store, or transmit the
                numbers you enter.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Can I suggest a new calculator?</h3>
              <p>
                Absolutely! Send us an email with your suggestion and we&apos;ll consider adding it.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
