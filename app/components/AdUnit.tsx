"use client";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  responsive?: boolean;
  className?: string;
}

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adSenseId) {
    return (
      <div
        className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-400 ${className}`}
      >
        Ad Space — Configure NEXT_PUBLIC_ADSENSE_ID
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adSenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  );
}
