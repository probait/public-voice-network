import React, { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActiveCampaign, useMPs, useSupports, useFeaturedThoughtCategorySummary } from "@/hooks/useLettersData";
import MPProgressItem from "@/components/letters/MPProgressItem";
import SupportForm from "@/components/letters/SupportForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const LettersForAction: React.FC = () => {
  const { data: campaign, isLoading: loadingCampaign } = useActiveCampaign();
  const { data: mps, isLoading: loadingMps } = useMPs();
  const { data: featuredSummary } = useFeaturedThoughtCategorySummary();
  const [supportsKey, setSupportsKey] = useState(0); // force refetch after submit
  const { data: supports, isLoading: loadingSupports } = useSupports(campaign?.id);
  // supportsKey is used as part of the queryKey via component remount on submit
  // but since useSupports uses queryKey with campaignId only, we'll just refetch by toggling key on SupportForm submit via invalidate? Keep simple: change a local key to re-render SupportForm and re-run queries.
  // However, useSupports won't re-run unless queryKey changes. To keep simple, we will rely on inevitable cache invalidation by time; but better: we can recompute derived counts using supports array as is, and onSubmitted we can manually fetch via window.location.hash trick. Simpler: we can force remount of the section that uses useSupports by key on parent container.

  const supportsByMp = useMemo(() => {
    const map = new Map<string, number>();
    if (supports) {
      for (const s of supports) {
        map.set(s.mp_id, (map.get(s.mp_id) || 0) + 1);
      }
    }
    return map;
  }, [supports]);

  const provinces = useMemo(() => {
    return mps ? Array.from(new Set(mps.map((m) => m.province))).sort() : [];
  }, [mps]);

  const [provinceFilter, setProvinceFilter] = useState<string>("");

  const filteredMPs = useMemo(() => {
    if (!mps) return [];
    return provinceFilter ? mps.filter((m) => m.province === provinceFilter) : mps;
  }, [mps, provinceFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900">Letters for Action</h1>
            <p className="mt-3 text-gray-700">
              We’re organizing citizen-backed letters to Members of Parliament. For each riding, our goal is to gather
              support from at least 10% of the riding’s population. Once a riding reaches 100% of this target, our staff
              will manually send the letter to that MP. You can show your support by adding a short 1–2 sentence comment.
            </p>
            <div className="mt-3 text-sm text-gray-600">
              The progress bars below show: current supporters vs. goal = 10% of the riding population (rounded up).
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {loadingCampaign ? "Loading letter..." : (campaign?.title || "Active Letter")}
                    {campaign?.scope === "national" && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">National</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  {loadingCampaign ? (
                    <div className="text-gray-600">Fetching the letter content…</div>
                  ) : campaign ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{campaign.body_md}</ReactMarkdown>
                  ) : (
                    <div className="text-gray-600">
                      No active letter found. Please check back soon.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data highlights (from featured citizen thoughts)</CardTitle>
                </CardHeader>
                <CardContent>
                  {featuredSummary && featuredSummary.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-800">
                      {featuredSummary.map((item) => (
                        <li key={item.category}>
                          <span className="font-medium">{item.category}:</span> {item.count} mentions
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600">We’ll show highlights here as we feature more submissions.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card key={`support-form-${supportsKey}`}>
                <CardHeader>
                  <CardTitle>Add your support</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingCampaign || loadingMps ? (
                    <div className="text-gray-600">Loading…</div>
                  ) : campaign && mps && mps.length > 0 ? (
                    <SupportForm
                      campaignId={campaign.id}
                      mps={mps}
                      onSubmitted={() => setSupportsKey((k) => k + 1)}
                    />
                  ) : (
                    <div className="text-gray-600">
                      We don’t have MPs loaded yet. Please import MPs into the “mps” table with columns:
                      full_name, email, riding_name, province, population, source_url.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How sending works</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-2">
                  <p>
                    - Each riding has a goal equal to 10% of its population. When the bar hits 100%, our staff will send
                    the letter to that MP manually.
                  </p>
                  <p>
                    - Your short comment is included as part of the public show of support; display name is optional.
                  </p>
                  <p>
                    - We’ll keep this page updated as support grows and new data gets featured.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-10 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">Riding progress</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Filter by province:</label>
                <select
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loadingMps || loadingSupports ? (
                <div className="text-gray-600">Loading riding progress…</div>
              ) : filteredMPs.length === 0 ? (
                <div className="text-gray-600">No MPs found.</div>
              ) : (
                filteredMPs.map((mp) => {
                  const count = supportsByMp.get(mp.id) || 0;
                  const goal = Math.ceil(mp.population * 0.1);
                  return (
                    <MPProgressItem
                      key={mp.id}
                      fullName={mp.full_name}
                      ridingName={mp.riding_name}
                      province={mp.province}
                      population={mp.population}
                      supports={count}
                      goal={goal}
                    />
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LettersForAction;
