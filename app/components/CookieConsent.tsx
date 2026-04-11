"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          We use cookies and third-party advertising services (Google AdSense) to improve your
          experience and show relevant ads. By clicking &quot;Accept&quot;, you consent to the use of
          cookies as described in our{" "}
          <Link href="/privacy" className="text-blue-700 underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
