const SEGMENTS = [
  { label: "Account (required)", pct: 25, rationale: "Company details, contacts and W-9 — pre-filled from your ERP." },
  { label: "Invoice (required)", pct: 25, rationale: "Invoice routing and bank details so payments can settle." },
  { label: "Purchase Order", pct: 20, rationale: "Enable PO routing to receive orders from Acme." },
  { label: "Catalog", pct: 15, rationale: "Publish your catalog so Acme can transact against it." },
  { label: "Taulia Virtual Card Payment", pct: 15, rationale: "Turn on virtual card payment to receive funds faster." },
];

export const SegmentationStrategy = () => {
  return (
    <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        <p className="text-[13px] text-muted-foreground">Onboarding Summary:</p>
        <div className="mt-3 space-y-4 text-[13.5px] leading-relaxed text-foreground/85">
          <p>
            Joule sequenced a 5-step path to transact with Acme, placing the two required activities
            first. Start by completing your{" "}
            <span className="font-semibold text-foreground">Account setup</span>, then configure{" "}
            <span className="font-semibold text-foreground">Invoice routing</span> and bank details so
            payments can settle without manual follow-up.
          </p>
          <p>
            Next, enable Purchase Order routing and publish your Catalog so Acme can transact against
            it. Finish by turning on Taulia Virtual Card Payment to receive funds. Joule will pre-fill
            roughly 80% of fields from your ERP and W-9.
          </p>
        </div>
      </div>

      <div>
        <p className="text-[13px] text-muted-foreground">Step Summary:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[13.5px] leading-relaxed text-foreground/85">
          {SEGMENTS.map((s) => (
            <li key={s.label}>
              <span className="font-semibold text-foreground">{s.label}</span>
              <span> — {s.rationale} ({s.pct}% of setup)</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
