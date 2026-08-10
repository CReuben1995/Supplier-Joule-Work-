import { MoreHorizontal, ExternalLink } from "lucide-react";
import sapLogo from "@/assets/sap-logo.png.asset.json";

type Article = {
  title: string;
  summary: string;
  source: string;
  time: string;
  tag: string;
  tagTone: "opportunity" | "compliance" | "logistics" | "sustain" | "ai" | "pricing";
  image: string;
  imageFit?: "cover" | "contain";
};

const articles: Article[] = [
  {
    title: "Acme Manufacturing opens Q3 RFQ wave for precision components — suppliers can respond in-network",
    summary:
      "Acme's sourcing team is inviting tier-1 vendors to bid on 42 SKUs across machining and stamping. Pre-qualified suppliers on SBN get first-look access.",
    source: "SAP Business Network",
    time: "1h ago",
    tag: "Opportunity",
    tagTone: "opportunity",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Red Sea reroutes stretch Asia–Europe transit by 10–14 days — update your promised ship dates",
    summary:
      "Buyers are pulling forward orders and asking suppliers to reconfirm lead times. Refresh your capacity calendar in SBN to keep OTIF scores intact.",
    source: "Supply Chain Dive",
    time: "3h ago",
    tag: "Logistics",
    tagTone: "logistics",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "EU CSRD wave-two: buyers will request Scope 3 & human-rights attestations from suppliers by Jan",
    summary:
      "If you sell into EU-listed customers, expect questionnaires within 60 days. Upload certificates once to your SBN profile to answer many buyers at scale.",
    source: "Procurement Magazine",
    time: "5h ago",
    tag: "Compliance",
    tagTone: "compliance",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "SAP Business Network launches AI-assisted catalog enrichment for suppliers",
    summary:
      "Joule can now auto-suggest UNSPSC codes, product images and descriptions from your ERP — cutting catalog upload time by up to 70%.",
    source: "SAP News",
    time: "Yesterday",
    tag: "AI",
    tagTone: "ai",
    image: sapLogo.url,
    imageFit: "cover" as const,
  },
  {
    title: "Steel & aluminum tariff shifts — recalculate your landed-cost quotes for North American buyers",
    summary:
      "Section 232 revisions add 10–25% duties on select imports. Suppliers should re-price open quotes and flag pass-through changes in upcoming POs.",
    source: "Bloomberg",
    time: "2d ago",
    tag: "Pricing",
    tagTone: "pricing",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "62% of suppliers still can't share Scope 3 data — early responders win preferred-vendor status",
    summary:
      "Buyers reward suppliers who publish emissions data early. Use the SBN sustainability profile to answer CDP-style questionnaires in one click.",
    source: "GreenBiz",
    time: "3d ago",
    tag: "Sustainability",
    tagTone: "sustain",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60",
  },
];

const tagStyles: Record<Article["tagTone"], string> = {
  opportunity: "bg-emerald-100 text-emerald-800",
  compliance: "bg-blue-100 text-blue-800",
  logistics: "bg-amber-100 text-amber-800",
  sustain: "bg-emerald-100 text-emerald-800",
  ai: "bg-violet-100 text-violet-800",
  pricing: "bg-slate-200 text-slate-800",
};

const NewsCard = ({ a }: { a: Article }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
    <div
      className={`h-40 w-full bg-center bg-no-repeat ${a.imageFit === "contain" ? "bg-contain bg-white" : "bg-cover"}`}
      style={{ backgroundImage: `url(${a.image})` }}
    />
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">{a.source}</span>
          <span>·</span>
          <span>{a.time}</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <h3 className="mt-2 text-[15px] font-semibold leading-snug">{a.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[12px] text-muted-foreground">{a.summary}</p>
      <div className="mt-4 flex items-center justify-between pt-2">
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${tagStyles[a.tagTone]}`}
        >
          {a.tag}
        </span>
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-link hover:underline">
          Read more <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  </article>
);

export const NewsCards = () => (
  <section className="mt-6 grid gap-5 md:grid-cols-3">
    {articles.map((a) => (
      <NewsCard key={a.title} a={a} />
    ))}
  </section>
);
