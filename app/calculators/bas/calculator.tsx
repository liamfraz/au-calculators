"use client";

import { useState, useMemo } from "react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function BasCalculator() {
  const [revenue, setRevenue] = useState<string>("");
  const [gstCollected, setGstCollected] = useState<string>("");
  const [gstPaid, setGstPaid] = useState<string>("");
  const [paygWithholding, setPaygWithholding] = useState<string>("");
  const [fuelTaxCredits, setFuelTaxCredits] = useState<string>("");

  const hasInput = useMemo(() => {
    return (
      revenue.trim() !== "" ||
      gstCollected.trim() !== "" ||
      gstPaid.trim() !== "" ||
      paygWithholding.trim() !== "" ||
      fuelTaxCredits.trim() !== ""
    );
  }, [revenue, gstCollected, gstPaid, paygWithholding, fuelTaxCredits]);

  const calculations = useMemo(() => {
    const rev = parseFloat(revenue) || 0;
    const collected = parseFloat(gstCollected) || 0;
    const paid = parseFloat(gstPaid) || 0;
    const payg = parseFloat(paygWithholding) || 0;
    const fuel = parseFloat(fuelTaxCredits) || 0;
    const expectedGst = rev * 0.1;

    const netGst = collected - paid - fuel;
    const totalOwing = netGst + payg;

    return { rev, collected, paid, payg, fuel, netGst, totalOwing, expectedGst };
  }, [gstCollected, gstPaid, paygWithholding, fuelTaxCredits]);

  // Determine current quarter (April 2026 = Q4)
  const getCurrentQuarter = () => {
    const month = 4; // April
    if (month >= 7) return 0; // Q1
    if (month >= 4) return 3; // Q4
    if (month >= 1) return 2; // Q3
    return 1; // Q2
  };

  const currentQuarter = getCurrentQuarter();

  const quarters = [
    { label: "Q1", period: "July – September", dueDate: "28 October", index: 0 },
    { label: "Q2", period: "October – December", dueDate: "28 February", index: 1 },
    { label: "Q3", period: "January – March", dueDate: "28 April", index: 2 },
    { label: "Q4", period: "April – June", dueDate: "28 July", index: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">BAS Calculator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quarterly Revenue */}
          <div>
            <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">
              Quarterly Revenue (ex GST)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="revenue"
                type="number"
                min={0}
                step={0.01}
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {calculations.rev > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Expected GST: {formatCurrency(calculations.expectedGst)}
              </p>
            )}
          </div>

          {/* GST Collected */}
          <div>
            <label htmlFor="gst-collected" className="block text-sm font-medium text-gray-700 mb-1">
              GST Collected from Customers (1A)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="gst-collected"
                type="number"
                min={0}
                step={0.01}
                value={gstCollected}
                onChange={(e) => setGstCollected(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* GST Paid */}
          <div>
            <label htmlFor="gst-paid" className="block text-sm font-medium text-gray-700 mb-1">
              GST Paid on Business Purchases (1B)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="gst-paid"
                type="number"
                min={0}
                step={0.01}
                value={gstPaid}
                onChange={(e) => setGstPaid(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* PAYG Withholding */}
          <div>
            <label htmlFor="payg-withholding" className="block text-sm font-medium text-gray-700 mb-1">
              PAYG Withholding (W2)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="payg-withholding"
                type="number"
                min={0}
                step={0.01}
                value={paygWithholding}
                onChange={(e) => setPaygWithholding(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fuel Tax Credits */}
          <div>
            <label htmlFor="fuel-tax-credits" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Tax Credits <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="fuel-tax-credits"
                type="number"
                min={0}
                step={0.01}
                value={fuelTaxCredits}
                onChange={(e) => setFuelTaxCredits(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Only show if any input */}
      {hasInput && (
        <div className="space-y-4">
          {/* Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Net GST Card */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <p className="text-sm text-gray-600 mb-1">
                {calculations.netGst < 0 ? "GST Refund Due" : "Net GST Payable"}
              </p>
              <p
                className={`text-2xl font-bold ${
                  calculations.netGst < 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {calculations.netGst < 0
                  ? `−${formatCurrency(Math.abs(calculations.netGst))}`
                  : formatCurrency(calculations.netGst)}
              </p>
            </div>

            {/* PAYG Withholding Card */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <p className="text-sm text-gray-600 mb-1">PAYG Withholding (W2)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculations.payg)}</p>
            </div>
          </div>

          {/* Total Owing Card */}
          <div
            className={`border rounded-xl p-6 ${
              calculations.totalOwing <= 0
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                calculations.totalOwing <= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {calculations.totalOwing <= 0
                ? "Total Refund Due"
                : "Total Amount Owing to ATO"}
            </p>
            <p
              className={`text-3xl font-bold ${
                calculations.totalOwing <= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {calculations.totalOwing <= 0
                ? `−${formatCurrency(Math.abs(calculations.totalOwing))}`
                : formatCurrency(calculations.totalOwing)}
            </p>
            {calculations.totalOwing <= 0 && (
              <p className="text-sm text-green-700 mt-2 font-medium">
                GST Refund Due — No payment required
              </p>
            )}
          </div>
        </div>
      )}

      {/* Lodgement Deadline Table */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">ATO Lodgement Deadlines 2026</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Quarter</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Period</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => (
                <tr
                  key={q.index}
                  className={`border-b border-gray-100 ${
                    currentQuarter === q.index ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-gray-900 font-medium">{q.label}</td>
                  <td className="py-2 px-3 text-gray-600">{q.period}</td>
                  <td className="py-2 px-3 text-gray-600">{q.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Tax agent lodgements may receive a 4-week extension. Check with your agent.
        </p>
      </div>

      {/* Automate Your BAS Section */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Automate Your BAS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Xero Card */}
          <a
            href="https://www.xero.com/au/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-green-300 rounded-lg p-5 bg-white hover:bg-green-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Xero — BAS & GST Automation</h4>
            <p className="text-sm text-gray-600 mb-4">
              Australia&apos;s #1 accounting software. Xero auto-calculates your BAS, connects to ATO,
              and lodges directly. Free trial for 30 days.
            </p>
            <button className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Try Xero Free →
            </button>
            <p className="text-xs text-gray-500 mt-3">BAS lodgement, GST & payroll for AU businesses</p>
          </a>

          {/* MYOB Card */}
          <a
            href="https://www.myob.com/au"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-blue-300 rounded-lg p-5 bg-white hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">MYOB — Australian BAS Software</h4>
            <p className="text-sm text-gray-600 mb-4">
              MYOB AccountRight auto-fills your BAS from transactions, calculates GST, and submits
              directly to the ATO.
            </p>
            <button className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Try MYOB →
            </button>
            <p className="text-xs text-gray-500 mt-3">Trusted by 1M+ Australian businesses</p>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          These are partner links. We may earn a commission if you sign up, at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
