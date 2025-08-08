import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CalendarClock, Users, GraduationCap, Wallet, MapPin, Globe } from "lucide-react";

interface DatasetSummariesProps {
  rows: Record<string, any>[];
}

const normalize = (v: any) => (typeof v === "string" ? v.trim() : v);

type Sent = "positive" | "neutral" | "negative" | "unknown";

const inferSentiment = (row: Record<string, any>): Sent => {
  const fields = [
    "Q8_AI_helping_BC_community_text_OE_sentiment",
    "Q13_AI_impact_worries_text_OE_sentiment",
    "Q16_Indigenous_communities_involvement_AI_text_OE_sentiment",
    "Q17_Advice_BC_Leaders_text_OE_sentiment",
  ];
  const vals = fields.map(f => String(row[f] ?? "").toUpperCase());
  if (vals.some(v => v.includes("NEG"))) return "negative";
  if (vals.some(v => v.includes("POS"))) return "positive";
  if (vals.some(v => v.includes("NEU"))) return "neutral";
  return "unknown";
};

const tally = (list: string[]) => {
  const m = new Map<string, number>();
  list.forEach(v => {
    const key = (v && v !== "undefined" ? v : "Unknown").toString();
    m.set(key, (m.get(key) ?? 0) + 1);
  });
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
};

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

// Chart helpers for visual storytelling
const COLOR_PALETTE = [
  "hsl(var(--primary))",
  "hsl(var(--positive))",
  "hsl(var(--neutral))",
  "hsl(var(--negative))",
  "hsl(var(--foreground))",
  "hsl(var(--accent))",
];

type Segment = { name: string; value: number; fill: string };

const makeSegments = (items: Array<[string, number]>, max = 5): Segment[] => {
  const top = items.slice(0, max);
  const rest = items.slice(max);
  const restSum = rest.reduce((a, [, n]) => a + n, 0);
  const segs: Segment[] = top.map(([name, value], i) => ({
    name,
    value,
    fill: COLOR_PALETTE[i % COLOR_PALETTE.length],
  }));
  if (restSum > 0) {
    segs.push({ name: "Other", value: restSum, fill: COLOR_PALETTE[segs.length % COLOR_PALETTE.length] });
  }
  return segs;
};

const categoryIcon: Record<string, React.ComponentType<any>> = {
  "Age groups": CalendarClock,
  "Gender": Users,
  "Education": GraduationCap,
  "Household income": Wallet,
  "Urban/Rural": MapPin,
  "Ethnicity": Globe,
};

const List: React.FC<{ items: Array<[string, number]>, total: number, max?: number }> = ({ items, total, max = 6 }) => (
  <ul className="space-y-2 text-sm" role="list">
    {items.slice(0, max).map(([k, n]) => (
      <li key={k} className="flex items-center justify-between" role="listitem">
        <span className="truncate mr-2" title={k}>{k}</span>
        <span className="text-muted-foreground" aria-label={`${n} responses, ${pct(n, total)} percent`}>{n} • {pct(n, total)}%</span>
      </li>
    ))}
  </ul>
);

const DatasetSummaries: React.FC<DatasetSummariesProps> = ({ rows }) => {
  const total = rows.length;

  const regionStats = useMemo(() => {
    const groups = new Map<string, { count: number; pos: number; neu: number; neg: number; unk: number }>();
    rows.forEach(r => {
      const region = String(normalize(r["Q1_Location_in_BC"]) || "Unknown");
      const g = groups.get(region) ?? { count: 0, pos: 0, neu: 0, neg: 0, unk: 0 };
      g.count += 1;
      const s = inferSentiment(r);
      if (s === "positive") g.pos += 1; else if (s === "neutral") g.neu += 1; else if (s === "negative") g.neg += 1; else g.unk += 1;
      groups.set(region, g);
    });
    const ordered = Array.from(groups.entries()).sort((a, b) => b[1].count - a[1].count);
    return { ordered };
  }, [rows]);

  const demographics = useMemo(() => {
    const fields = [
      ["AgeRollup_Broad", "Age groups"],
      ["Gender", "Gender"],
      ["Education", "Education"],
      ["HH_Income_Fine_23", "Household income"],
      ["Urban/ Rural", "Urban/Rural"],
      ["Ethnicity_Roll_23", "Ethnicity"],
    ] as const;
    const data = fields.map(([key, label]) => {
      const items = tally(rows.map(r => String(normalize(r[key]) || "Unknown")));
      return { key, label, items };
    });
    return { data };
  }, [rows]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-6" aria-labelledby="regional-summary-heading">
      <Card>
        <CardHeader>
          <CardTitle id="regional-summary-heading">Regional summary {total ? `(${total} responses)` : ""}</CardTitle>
        </CardHeader>
        <CardContent>
          {regionStats.ordered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No regional data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionStats.ordered.slice(0, 6).map(([region, g]) => (
                <div key={region} className="rounded-md border p-3" role="group" aria-label={`Region ${region}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate" title={region}>{region}</h4>
                    <span className="text-xs text-muted-foreground" aria-label="Responses count">{g.count}</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded overflow-hidden flex" aria-label="Sentiment distribution" role="img">
                    <div className="h-3 bg-positive rounded-l" style={{ width: `${pct(g.pos, g.count)}%` }} aria-label={`Positive ${pct(g.pos, g.count)}%`} />
                    <div className="h-3 bg-neutral" style={{ width: `${pct(g.neu, g.count)}%` }} aria-label={`Neutral ${pct(g.neu, g.count)}%`} />
                    <div className="h-3 bg-negative rounded-r" style={{ width: `${pct(g.neg, g.count)}%` }} aria-label={`Negative ${pct(g.neg, g.count)}%`} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-positive/15 px-2 py-0.5">
                      <span className="h-2 w-2 rounded-full bg-positive" />
                      {pct(g.pos, g.count)}% positive
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral/15 px-2 py-0.5">
                      <span className="h-2 w-2 rounded-full bg-neutral" />
                      {pct(g.neu, g.count)}% neutral
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-negative/15 px-2 py-0.5">
                      <span className="h-2 w-2 rounded-full bg-negative" />
                      {pct(g.neg, g.count)}% negative
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demographic breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Who is speaking: a snapshot of the people behind these voices.</p>

          {/* Headline stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {demographics.data.map(({ label, items }) => {
              const [topLabel, topCount] = items[0] || ["Unknown", 0];
              const percent = pct(topCount, total);
              const Icon = categoryIcon[label] || Users;
              return (
                <div key={label} className="flex items-center gap-3 rounded-md border p-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-medium truncate" title={String(topLabel)}>{String(topLabel)}</div>
                    <div className="text-xs text-muted-foreground">{percent}% of responses</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demographics.data.map(({ label, items }) => {
              const data = makeSegments(items, 5);
              const chartConfig = Object.fromEntries(
                data.map((d) => [d.name, { label: d.name }])
              );
              return (
                <div key={`${label}-chart`} className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{label}</h4>
                    <span className="text-xs text-muted-foreground">Top {Math.min(5, items.length)} + other</span>
                  </div>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie data={data} dataKey="value" nameKey="name" innerRadius={36} outerRadius={64} stroke="hsl(var(--background))" strokeWidth={2}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Summaries reflect the currently visible dataset (filters applied).</p>
    </section>
  );
};

export default DatasetSummaries;
