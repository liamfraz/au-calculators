"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type GstMode = "add" | "remove";

interface BulkLine {
  input: string;
  amount: number | null;
}

interface BasQuarter {
  label: string;
  collected: string;
  paid: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function addGst(exGst: number) {
  const gst = exGst * 0.1;
  return { exGst, gst, total: exGst + gst };
}

function removeGst(incGst: number) {
  const exGst = incGst / 1.1;
  const gst = incGst - exGst;
  return { exGst, gst, total: incGst };
}

const EMPTY_QUARTERS: BasQuarter[] = [
  { label: "Jul – Sep (Q1)", collected: "", paid: "" },
  { label: "Oct – Dec (Q2)", collected: "", paid: "" },
  { label: "Jan – Mar (Q3)", collected: "", paid: "" },
  { label: "Apr – Jun (Q4)", collected: "", paid: "" },
];

export default function GstCalculator() {
  // --- Single calculator ---
  const [mode, setMode] = useState<GstMode>("add");
  const [amount, setAmount] = useState<string>("1000");

  const singleResult = useMemo(() => {
    const num = parseFloat(amount) || 0;
    return mode === "add" ? addGst(num) : removeGst(num);
  }, [mode, amount]);

  // --- Bulk mode ---
  const [bulkText, setBulkText] = useState("");
  const [bulkMode, setBulkMode] = useState<GstMode>("add");

  const bulkLines = useMemo<BulkLine[]>(() => {
    if (!bulkText.trim()) return [];
    return bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const cleaned = s.replace(/[$,\s]/g, "");
        const num = parseFloat(cleaned);
        return { input: s, amount: isNaN(num) ? null : num };
      });
  }, [bulkText]);

  const bulkResults = useMemo(() => {
    return bulkLines.map((line) => {
      if (line.amount === null) return { ...line, exGst: 0, gst: 0, total: 0, valid: false };
      const calc = bulkMode === "add" ? addGst(line.amount) : removeGst(line.amount);
      return { ...line, ...calc, valid: true };
    });
  }, [bulkLines, bulkMode]);

  const bulkTotals = useMemo(() => {
    return bulkResults
      .filter((r) => r.valid)
      .reduce(
        (acc, r) => ({ exGst: acc.exGst + r.exGst, gst: acc.gst + r.gst, total: acc.total + r.total }),
        { exGst: 0, gst: 0, total: 0 },
      );
  }, [bulkResults]);

  // --- BAS helper ---
  const [quarters, setQuarters] = useState<BasQuarter[]>(EMPTY_QUARTERS);

  function updateQuarter(index: number, field: "collected" | "paid", value: string) {
    setQuarters((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  }

  const basResults = useMemo(() => {
    return quarters.map((q) => {
      const collected = parseFloat(q.collected.replace(/[$,\s]/g, "")) || 0;
      const paid = parseFloat(q.paid.replace(/[$,\s]/g, "")) || 0;
      const net = collected - paid;
      return { ...q, collectedNum: collected, paidNum: paid, net };
    });
  }, [quarters]);

  const basTotal = useMemo(() => {
    return basResults.reduce(
      (acc, q) => ({
        collected: acc.collected + q.collectedNum,
        paid: acc.paid + q.paidNum,
        net: acc.net + q.net,
      }),
      { collected: 0, paid: 0, net: 0 },
    );
  }, [basResults]);

  return (
    <div className="space-y-8">
      {/* Single GST Calculator */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">GST Calculator</h2>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {([["add", "Add GST"], ["remove", "Remove GST"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                mode === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label htmlFor="gst-amount" className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "add" ? "Amount (ex. GST)" : "Amount (inc. GST)"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="gst-amount"
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Single Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">Ex. GST</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(singleResult.exGst)}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 bg-white text-center">
          <p className="text-sm text-gray-500 mb-1">GST (10%)</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(singleResult.gst)}</p>
        </div>
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 text-center">
          <p className="text-sm text-blue-700 mb-1">Inc. GST</p>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(singleResult.total)}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-3">Calculation Breakdown</h3>
        <div className="space-y-2 text-sm">
          {mode === "add" ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Original amount (ex. GST)</span>
                <span className="font-medium">{formatCurrency(singleResult.exGst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (10% of {formatCurrency(singleResult.exGst)})</span>
                <span className="font-medium text-green-600">+{formatCurrency(singleResult.gst)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Total inc. GST</span>
                <span className="text-blue-800">{formatCurrency(singleResult.total)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Formula: {formatCurrency(singleResult.exGst)} &times; 1.1 = {formatCurrency(singleResult.total)}
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount inc. GST</span>
                <span className="font-medium">{formatCurrency(singleResult.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST component</span>
                <span className="font-medium text-green-600">{formatCurrency(singleResult.gst)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Amount ex. GST</span>
                <span className="text-blue-800">{formatCurrency(singleResult.exGst)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Formula: {formatCurrency(singleResult.total)} &divide; 1.1 = {formatCurrency(singleResult.exGst)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bulk Mode */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">Bulk GST Calculator</h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste multiple amounts (one per line or comma-separated) to calculate GST for each.
        </p>

        <div className="flex gap-2 mb-4">
          {([["add", "Add GST"], ["remove", "Remove GST"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setBulkMode(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                bulkMode === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"100\n250.50\n1,500\n3200"}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono mb-4"
        />

        {bulkResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-700">Input</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Ex. GST</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">GST</th>
                  <th className="text-right py-2 pl-4 font-medium text-gray-700">Inc. GST</th>
                </tr>
              </thead>
              <tbody>
                {bulkResults.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-600">{r.input}</td>
                    {r.valid ? (
                      <>
                        <td className="text-right py-2 px-4">{formatCurrency(r.exGst)}</td>
                        <td className="text-right py-2 px-4 text-green-600">{formatCurrency(r.gst)}</td>
                        <td className="text-right py-2 pl-4 font-semibold">{formatCurrency(r.total)}</td>
                      </>
                    ) : (
                      <td colSpan={3} className="text-right py-2 pl-4 text-red-500 text-xs">
                        Invalid number
                      </td>
                    )}
                  </tr>
                ))}
                {bulkResults.filter((r) => r.valid).length > 1 && (
                  <tr className="border-t-2 border-gray-300 font-semibold">
                    <td className="py-2 pr-4 text-gray-900">Total</td>
                    <td className="text-right py-2 px-4">{formatCurrency(bulkTotals.exGst)}</td>
                    <td className="text-right py-2 px-4 text-green-600">{formatCurrency(bulkTotals.gst)}</td>
                    <td className="text-right py-2 pl-4">{formatCurrency(bulkTotals.total)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BAS Helper */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-1">BAS GST Helper</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your quarterly GST collected (on sales) and GST paid (on purchases) to calculate
          your net GST payable or refund for BAS reporting.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-700">Quarter</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">GST Collected</th>
                <th className="text-right py-2 px-2 font-medium text-gray-700">GST Paid</th>
                <th className="text-right py-2 pl-4 font-medium text-gray-700">Net GST</th>
              </tr>
            </thead>
            <tbody>
              {basResults.map((q, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">{q.label}</td>
                  <td className="py-2 px-2">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={q.collected}
                        onChange={(e) => updateQuarter(i, "collected", e.target.value)}
                        placeholder="0"
                        className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded text-right text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={q.paid}
                        onChange={(e) => updateQuarter(i, "paid", e.target.value)}
                        placeholder="0"
                        className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded text-right text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </td>
                  <td className={`text-right py-2 pl-4 font-medium whitespace-nowrap ${
                    q.net > 0 ? "text-red-600" : q.net < 0 ? "text-green-600" : "text-gray-400"
                  }`}>
                    {q.collectedNum === 0 && q.paidNum === 0
                      ? "—"
                      : q.net >= 0
                        ? formatCurrency(q.net)
                        : `−${formatCurrency(Math.abs(q.net))}`}
                    {q.collectedNum === 0 && q.paidNum === 0
                      ? ""
                      : q.net > 0
                        ? " payable"
                        : q.net < 0
                          ? " refund"
                          : ""}
                  </td>
                </tr>
              ))}
              {(basTotal.collected > 0 || basTotal.paid > 0) && (
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td className="py-2 pr-4 text-gray-900">Annual Total</td>
                  <td className="text-right py-2 px-2">{formatCurrency(basTotal.collected)}</td>
                  <td className="text-right py-2 px-2">{formatCurrency(basTotal.paid)}</td>
                  <td className={`text-right py-2 pl-4 whitespace-nowrap ${
                    basTotal.net > 0 ? "text-red-600" : basTotal.net < 0 ? "text-green-600" : "text-gray-900"
                  }`}>
                    {basTotal.net >= 0
                      ? formatCurrency(basTotal.net)
                      : `−${formatCurrency(Math.abs(basTotal.net))}`}
                    {basTotal.net > 0 ? " payable" : basTotal.net < 0 ? " refund" : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Positive = you owe the ATO. Negative = the ATO owes you a refund.
          This is a simplified helper — consult your accountant or BAS agent for lodgement.
        </p>
      </div>

      {/* Related Calculators */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/tax-withholding-calculator"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Tax Withholding Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/super"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Superannuation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/capital-gains-tax"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Capital Gains Tax Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
          <Link
            href="/calculators/depreciation"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-blue-600 font-medium">Depreciation Calculator</span>
            <span className="text-gray-400 ml-auto">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
