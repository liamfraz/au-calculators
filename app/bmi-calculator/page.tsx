import type { Metadata } from "next";
import BMICalculator from "./calculator";
import AdUnit from "../components/AdUnit";

export const metadata: Metadata = {
  title: "BMI Calculator Australia — Body Mass Index & Healthy Weight",
  description:
    "Free Australian BMI calculator. Calculate your Body Mass Index, healthy weight range, ideal weight, and waist-to-height ratio. Includes AU health guidelines for Asian populations.",
  keywords: [
    "bmi calculator australia",
    "bmi calculator",
    "healthy weight calculator",
    "body mass index calculator",
    "ideal weight calculator",
    "bmi chart",
    "healthy weight range",
    "bmi calculator metric",
    "waist to height ratio calculator",
  ],
  openGraph: {
    title: "BMI Calculator Australia — Body Mass Index & Healthy Weight",
    description:
      "Calculate your BMI, healthy weight range, and ideal weight. Free Australian BMI calculator with health guidelines.",
    type: "website",
  },
};

const faqs = [
  {
    question: "What is a healthy BMI range?",
    answer:
      "For most adults, a normal BMI is between 18.5 and 24.9. A BMI below 18.5 is considered underweight, 25–29.9 is overweight, and 30 or above is obese. However, for people of Asian descent in Australia, Australian health guidelines lower these thresholds — overweight starts at a BMI of 23 and obese at 27.5. It is also worth noting that BMI does not account for muscle mass, so highly muscular individuals may have a high BMI without carrying excess body fat.",
  },
  {
    question: "How accurate is BMI as a health measure?",
    answer:
      "BMI is a useful screening tool but is not a diagnostic measure. It does not account for muscle mass, bone density, age, sex, ethnicity, or body fat distribution. Athletes and highly muscular people may have a high BMI while carrying very little body fat, which can make BMI misleading in those cases. BMI is best used alongside other measures such as waist circumference, waist-to-height ratio, and a professional medical assessment for a more complete picture of health.",
  },
  {
    question: "What is the waist-to-height ratio and why does it matter?",
    answer:
      "The waist-to-height ratio is a measure that complements BMI by accounting for where fat is stored on the body. It is calculated by dividing your waist circumference by your height. A ratio below 0.5 is generally considered healthy for most adults. Central or abdominal fat — the fat stored around the organs in your midsection — is a stronger predictor of cardiovascular disease, type 2 diabetes, and metabolic syndrome than overall weight or BMI alone.",
  },
  {
    question: "How is ideal weight calculated?",
    answer:
      "Ideal weight estimates are based on four established clinical formulas: Devine, Robinson, Miller, and Hamwi. These formulas calculate a target weight based on height and sex. It is important to note they were originally developed for clinical purposes such as medication dosing, not as personal health targets. The results should be treated as a general reference range rather than a strict goal, and should be considered alongside your BMI, waist-to-height ratio, and advice from a healthcare professional.",
  },
  {
    question: "Does BMI apply differently to different populations in Australia?",
    answer:
      "Yes. Australian health guidelines recognise that standard BMI categories may not be appropriate for all population groups. For people of Asian descent, the overweight threshold is lowered to a BMI of 23 and the obese threshold to 27.5, as research shows higher health risks at lower BMI values in these populations. There are also considerations for people of Aboriginal or Torres Strait Islander descent. For a personalised assessment of what a healthy weight range looks like for you, it is best to consult your GP.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BMI Calculator Australia",
  description:
    "Free Australian BMI calculator. Calculate your Body Mass Index, healthy weight range, ideal weight, and waist-to-height ratio. Includes AU health guidelines for Asian populations.",
  url: "https://au-calculators.vercel.app/bmi-calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  author: {
    "@type": "Organization",
    name: "AU Calculators",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function BMICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BMI Calculator Australia
          </h1>
          <p className="text-gray-600">
            Calculate your Body Mass Index (BMI), healthy weight range, and ideal weight using
            Australian health guidelines. BMI is a widely used screening measure that helps assess
            whether your weight falls within a healthy range for your height.
          </p>
        </div>

        {/* Ad: Above calculator */}
        <AdUnit slot="above-calculator" format="horizontal" className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <BMICalculator />

            {/* Ad: Below results */}
            <AdUnit slot="below-results" format="horizontal" className="mt-8" />
          </div>

          {/* Sidebar ad: Desktop only */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
