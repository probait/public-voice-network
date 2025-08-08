import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map as MapLibreMap, MapLayerMouseEvent, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Papa from "papaparse";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DataFilters from "@/components/map/DataFilters";
import ClusterModal from "@/components/map/ClusterModal";
import EntryDrawer from "@/components/map/EntryDrawer";
import DatasetSummaries from "@/components/map/DatasetSummaries";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// NOTE: Vite will bundle the CSV when referenced via new URL
const datasetUrl = new URL("../../vanai-hackathon-003-main/Hackathon round 3 with demos[48].csv", import.meta.url).toString();

type Thought = {
  id: string;
  text: string;
  location: string;
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  category?: string;
  date?: string;
};

type GeoFeature = GeoJSON.Feature<GeoJSON.Point, Thought>;

type FiltersState = {
  sentiments: Set<Thought["sentiment"]>;
};

// Approximate centroids for BC regions and major cities
const REGION_CENTROIDS: Record<string, [number, number]> = {
  // Broad regions
  "Vancouver Island and Coast": [-124.5, 49.7],
  "Mainland/Southwest": [-123.3, 49.25],
  "Thompson-Okanagan": [-119.5, 50.7],
  "Kootenay": [-116.9, 49.7],
  "Cariboo": [-122.5, 52.5],
  "Nechako": [-125.7, 54.4],
  "North Coast": [-128.6, 54.3],
  "Northeast": [-121.2, 56.7],
  // Cities
  "Vancouver": [-123.1207, 49.2827],
  "Victoria": [-123.3656, 48.4284],
  "Surrey": [-122.8490, 49.1913],
  "Burnaby": [-122.9697, 49.2488],
  "Richmond": [-123.136, 49.1666],
  "Coquitlam": [-122.800, 49.283],
  "Abbotsford": [-122.252, 49.050],
  "Langley": [-122.660, 49.104],
  "Nanaimo": [-123.9401, 49.1659],
  "Kelowna": [-119.4960, 49.8879],
  "Kamloops": [-120.3273, 50.6745],
  "Prince George": [-122.7497, 53.9171],
  "Chilliwack": [-121.958, 49.157],
  "Maple Ridge": [-122.573, 49.219],
  // Additional sub-areas for creative spreading around Vancouver
  "West Vancouver": [-123.165, 49.327],
  "North Vancouver": [-123.072, 49.320],
  "Port Moody": [-122.852, 49.284],
};

// Canada bounding box (approximate)
const CANADA_BOUNDS: [[number, number], [number, number]] = [[-141.1, 41.5], [-52.6, 83.2]];

// Heuristic helpers
const normalize = (s: unknown) => (typeof s === "string" ? s.trim() : "");

const detectSentiment = (row: Record<string, any>): Thought["sentiment"] => {
  // 1) Direct sentiment fields if present
  for (const key of Object.keys(row)) {
    const lk = key.toLowerCase();
    if (lk.includes("sentiment")) {
      const v = String(row[key]).toLowerCase();
      if (["pos", "positive", "1", "+1", "true", "yes"].includes(v)) return "positive";
      if (["neg", "negative", "-1", "false", "no"].includes(v)) return "negative";
      if (["neutral", "0", "mixed"].includes(v)) return "neutral";
    }
  }

  // 2) Likert-style numeric scales (common in surveys)
  const numCandidateKeys = Object.keys(row).filter(k => /experience|satisfaction|support|agreement|trust|concern|risk|benefit|impact|confidence/i.test(k));
  for (const k of numCandidateKeys) {
    const raw = row[k];
    const n = typeof raw === "number" ? raw : parseFloat(raw);
    if (Number.isFinite(n)) {
      // Map 1-5 scales
      if (n >= 1 && n <= 5) {
        if (n >= 4) return "positive";
        if (n <= 2) return "negative";
        return "neutral"; // ~3
      }
      // Map 0-10 scales
      if (n >= 0 && n <= 10) {
        if (n >= 7) return "positive";
        if (n <= 3) return "negative";
        return "neutral";
      }
    }
  }

  // 3) Simple keyword heuristic on open-ended text fields
  const textKeys = Object.keys(row).filter(k => /_OE$|open|comment|text|advice/i.test(k));
  for (const k of textKeys) {
    const t = String(row[k] ?? "").toLowerCase();
    if (!t) continue;
    const positives = ["good", "great", "benefit", "help", "positive", "improve", "support", "opportunity"];
    const negatives = ["bad", "worse", "harm", "risk", "negative", "concern", "problem", "danger"];
    let score = 0;
    positives.forEach(w => { if (t.includes(w)) score += 1; });
    negatives.forEach(w => { if (t.includes(w)) score -= 1; });
    if (score >= 2) return "positive";
    if (score <= -2) return "negative";
    if (score !== 0) return score > 0 ? "positive" : "negative";
  }

  return "unknown";
};

const detectCategory = (row: Record<string, any>): string | undefined => {
  const keys = Object.keys(row);
  // Prefer a direct category field if present
  const direct = keys.find(k => /category|topic/i.test(k));
  if (direct) {
    const v = normalize(row[direct]);
    if (v) return String(v);
  }
  // Otherwise, pick the first non-empty binary/topic column name
  const topic = keys.find(k => /policy|ai|safety|ethic|regulation|health|education/i.test(k) && row[k]);
  if (topic) return topic;
  return undefined;
};

const detectText = (row: Record<string, any>): string => {
  // Prefer known open-ended response fields
  const candidates = [
    "Q17_Advice_BC_Leaders_text_OE",
  ];
  for (const c of candidates) {
    if (row[c]) return String(row[c]);
  }
  // Fallback: any *_OE field with content
  const fallbackKey = Object.keys(row).find(k => /_OE$/i.test(k) && row[k]);
  return String(row[fallbackKey ?? ""]) || "";
};

const detectLocation = (row: Record<string, any>): string => {
  const candidates = ["Q1_Location_in_BC", "Location", "City", "Region"];
  for (const c of candidates) {
    if (row[c]) return String(row[c]);
  }
  // try to detect any field with 'location'
  const anyLoc = Object.keys(row).find(k => /location|region|city/i.test(k) && row[k]);
  return String(anyLoc ? row[anyLoc] : "");
};

const lookUpCoord = (loc: string): [number, number] | null => {
  if (!loc) return null;
  const key = loc.trim();
  if (REGION_CENTROIDS[key]) return REGION_CENTROIDS[key];
  // Try case-insensitive and partial matches
  const found = Object.entries(REGION_CENTROIDS).find(([name]) =>
    name.toLowerCase() === key.toLowerCase() || key.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(key.toLowerCase())
  );
  return found ? found[1] : null;
};

// Deterministic small spatial separation for overlapping points
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const kmToDegrees = (lat: number, km: number): [number, number] => {
  const dLat = km / 111; // ~km per degree latitude
  const dLon = km / (111 * Math.cos((lat * Math.PI) / 180));
  return [dLon, dLat];
};

const applySpatialSeparation = (features: GeoFeature[]) => {
  const SEP_KM = 2; // target separation at closest zoom
  // Group indices by their exact coordinate pair
  const groups = new Map<string, number[]>();
  features.forEach((f, i) => {
    const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates as [number, number];
    const key = `${lon.toFixed(6)},${lat.toFixed(6)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(i);
  });

  const VAN_ANCHORS: [number, number][] = [
    REGION_CENTROIDS["Vancouver"],
    REGION_CENTROIDS["Burnaby"],
    REGION_CENTROIDS["North Vancouver"],
    REGION_CENTROIDS["West Vancouver"],
    REGION_CENTROIDS["Port Moody"],
  ].filter(Boolean) as [number, number][];

  groups.forEach((idxs) => {
    if (idxs.length <= 1) return;
    const [lon0, lat0] = (features[idxs[0]].geometry as GeoJSON.Point).coordinates as [number, number];
    const isVancouverCenter =
      Math.abs(lon0 - REGION_CENTROIDS["Vancouver"][0]) < 1e-3 &&
      Math.abs(lat0 - REGION_CENTROIDS["Vancouver"][1]) < 1e-3;

    if (isVancouverCenter) {
      // Distribute across anchors with weights; keep most in Vancouver
      const weights = [0.55, 0.15, 0.12, 0.10, 0.08];
      const counts = weights.map((w) => Math.floor(w * idxs.length));
      let remainder = idxs.length - counts.reduce((a, b) => a + b, 0);
      for (let i = 0; remainder > 0; i = (i + 1) % counts.length) {
        counts[i]++;
        remainder--;
      }
      let offset = 0;
      VAN_ANCHORS.forEach((anchor, aIdx) => {
        const count = counts[aIdx] ?? 0;
        for (let j = 0; j < count; j++) {
          const idx = idxs[offset + j];
          const angle = GOLDEN_ANGLE * j;
          const frac = count <= 1 ? 0 : j / (count - 1);
          const rKm = frac * SEP_KM;
          const [dLon, dLat] = kmToDegrees(anchor[1], rKm);
          const newLon = anchor[0] + Math.cos(angle) * dLon;
          const newLat = anchor[1] + Math.sin(angle) * dLat;
          (features[idx].geometry as GeoJSON.Point).coordinates = [newLon, newLat];
        }
        offset += count;
      });
    } else {
      // Generic spiral jitter around the original coordinate
      for (let j = 0; j < idxs.length; j++) {
        const idx = idxs[j];
        const angle = GOLDEN_ANGLE * j;
        const frac = idxs.length <= 1 ? 0 : j / (idxs.length - 1);
        const rKm = frac * SEP_KM;
        const [dLon, dLat] = kmToDegrees(lat0, rKm);
        const newLon = lon0 + Math.cos(angle) * dLon;
        const newLat = lat0 + Math.sin(angle) * dLat;
        (features[idx].geometry as GeoJSON.Point).coordinates = [newLon, newLat];
      }
    }
  });
};

const toGeoJSON = (rows: Record<string, any>[]): GeoJSON.FeatureCollection<GeoJSON.Point, Thought> => {
  const features: GeoFeature[] = [];
  rows.forEach((row, idx) => {
    const text = detectText(row);
    const location = detectLocation(row);
    const sentiment = detectSentiment(row);
    const category = detectCategory(row);
    const coords = lookUpCoord(location);
    if (!text || !coords) return; // skip if no text or no coordinates
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coords },
      properties: {
        id: String(idx),
        text,
        location,
        sentiment,
        category,
      },
    });
  });
  // Apply separation after creating all features
  applySpatialSeparation(features);
  return { type: "FeatureCollection", features };
};

const CANONICAL_URL = "/dataset-map";
 // Public token for demo

const DataSetMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const pulseRef = useRef<number>(0);

  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Thought> | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    sentiments: new Set(["positive", "neutral", "negative", "unknown"]),
  });
  const [loading, setLoading] = useState(true);

  const filteredData = useMemo(() => {
    if (!geoData) return geoData;
    const features = geoData.features.filter(f => {
      return filters.sentiments.has(f.properties.sentiment);
    });
    return { type: "FeatureCollection", features } as GeoJSON.FeatureCollection<GeoJSON.Point, Thought>;
  }, [geoData, filters]);

  // Group data by sentiment so clusters are separated per color at all zoom levels
  const groupedData = useMemo(() => {
    const empty = { type: "FeatureCollection", features: [] as GeoFeature[] } as GeoJSON.FeatureCollection<GeoJSON.Point, Thought>;
    if (!filteredData) {
      return { positive: empty, neutral: empty, negative: empty, unknown: empty } as Record<Thought["sentiment"], GeoJSON.FeatureCollection<GeoJSON.Point, Thought>>;
    }
    const groups: Record<Thought["sentiment"], GeoJSON.FeatureCollection<GeoJSON.Point, Thought>> = {
      positive: { type: "FeatureCollection", features: [] },
      neutral: { type: "FeatureCollection", features: [] },
      negative: { type: "FeatureCollection", features: [] },
      unknown: { type: "FeatureCollection", features: [] },
    } as any;
    filteredData.features.forEach((f) => {
      const s = (f.properties.sentiment as Thought["sentiment"]) || "unknown";
      (groups[s] ?? groups.unknown).features.push(f);
    });
    return groups;
  }, [filteredData]);

  useEffect(() => {
    // SEO basics
    document.title = "Voices Across Canada – Sentiment Map";
    const desc = "Interactive sentiment map: explore perspectives from across Canada with clustering, filters, and summaries.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL_URL);
  }, []);

  useEffect(() => {
    // Load CSV
    Papa.parse(datasetUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = (res.data as Record<string, any>[]).filter(r => Object.keys(r).length > 0);
        setRawRows(rows);
        const gj = toGeoJSON(rows);
        setGeoData(gj);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV parse error", err);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || loading || !geoData) return;
    

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [-96.8, 56.1],
      zoom: 0,
      pitch: 35,
      maxBounds: CANADA_BOUNDS,
    });
    mapRef.current = map;

    map.on("style.load", () => {

      const sentiments: Thought["sentiment"][] = ["positive", "neutral", "negative", "unknown"];
      const colors: Record<Thought["sentiment"], string> = {
        positive: "hsl(150, 60%, 45%)",
        neutral: "hsl(40, 85%, 55%)",
        negative: "hsl(0, 70%, 55%)",
        unknown: "hsl(220, 10%, 60%)",
      };

      // Screen-space offsets to visually separate overlapping clusters per sentiment
      const offsets: Record<Thought["sentiment"], [number, number]> = {
        positive: [-18, -18],   // NW
        neutral: [18, -18],     // NE
        negative: [18, 18],     // SE
        unknown: [-18, 18],     // SW
      };

      // Add one clustered source per sentiment and corresponding layers
      sentiments.forEach((s) => {
        map.addSource(`thoughts-${s}`, {
          type: "geojson",
          data: groupedData[s],
          cluster: true,
          clusterRadius: 50,
        } as any);

        // Cluster circles per sentiment
        map.addLayer({
          id: `clusters-${s}`,
          type: "circle",
          source: `thoughts-${s}`,
          filter: ["has", "point_count"],
          paint: {
            "circle-blur": 0.6,
            "circle-radius": ["interpolate", ["linear"], ["get", "point_count"], 2, 14, 50, 22, 200, 28],
            "circle-color": colors[s],
            "circle-opacity": 0.85,
            "circle-translate": offsets[s],
            "circle-stroke-color": "hsl(0, 0%, 100%)",
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.3,
          },
        });

        // Cluster count labels
        map.addLayer({
          id: `cluster-count-${s}`,
          type: "symbol",
          source: `thoughts-${s}`,
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-size": 12,
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-justify": "center",
            "text-padding": 0
          },
          paint: {
            "text-color": "hsl(0, 0%, 10%)",
            "text-halo-color": "hsl(0, 0%, 100%)",
            "text-halo-width": 1.2,
            "text-translate": offsets[s],
            "text-translate-anchor": "viewport",
          }
        });

        // Individual points per sentiment
        map.addLayer({
          id: `unclustered-point-${s}`,
          type: "circle",
          source: `thoughts-${s}`,
          filter: ["!has", "point_count"],
          paint: {
            "circle-radius": 6,
            "circle-color": colors[s],
            "circle-opacity": 0.95,
            "circle-blur": 0.35,
            "circle-translate": offsets[s],
            "circle-stroke-color": "hsl(0, 0%, 100%)",
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.5,
          },
        });
      });

      // Hover tooltip for unclustered layers
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      sentiments.forEach((s) => {
        const layer = `unclustered-point-${s}`;
        map.on("mousemove", layer, (e: MapLayerMouseEvent) => {
          const f = e.features?.[0] as unknown as GeoFeature | undefined;
          if (!f) return;
          const { text, location, sentiment } = f.properties;
          const safe = String(text).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const content = `<div style="max-width:280px"><strong>${location}</strong><br/><em>${sentiment}</em><br/><div style="margin-top:4px">${safe}</div></div>`;
          popupRef.current!.setLngLat(e.lngLat).setHTML(content).addTo(map);
        });
        map.on("mouseleave", layer, () => {
          popupRef.current?.remove();
        });
      });

      // Click unclustered point to open full response
      sentiments.forEach((s) => {
        const layer = `unclustered-point-${s}`;
        map.on("click", layer, (e: MapLayerMouseEvent) => {
          const f = e.features?.[0] as unknown as GeoFeature | undefined;
          if (!f) return;
          openFromThought(f.properties);
        });
      });

      // Click cluster to open modal (per sentiment layer)
      sentiments.forEach((s) => {
        const clusterLayerId = `clusters-${s}`;
        map.on("click", clusterLayerId, async (e: MapLayerMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, { layers: [clusterLayerId] });
          const clusterId = (features[0] as any)?.properties?.cluster_id;
          const src = map.getSource(`thoughts-${s}`) as any;
          if (!src || clusterId == null) return;
          src.getClusterLeaves(clusterId, 100, 0, (err: any, leaves: GeoFeature[]) => {
            if (err) return;
            setModalData(leaves.map(l => l.properties));
            setModalOpen(true);
            const coords = (features[0].geometry as any).coordinates as [number, number];
            map.easeTo({ center: coords, duration: 600, zoom: Math.min(map.getZoom() + 1.2, 9) });
          });
        });
      });

      // Pulse animation for clusters (gentle radius breathing)
      let grow = true;
      pulseRef.current = window.setInterval(() => {
        sentiments.forEach((s) => {
          const layerId = `clusters-${s}`;
          const cur = map.getPaintProperty(layerId, "circle-radius") as any;
          if (!cur) return;
          const factor = grow ? 1.02 : 0.98;
          const next = ["*", cur, factor];
          try {
            map.setPaintProperty(layerId, "circle-radius", next as any);
          } catch { }
        });
        grow = !grow;
      }, 1200);

      // Fit map to data extent on initial load so cluster numbers are in view
      if (filteredData && filteredData.features.length > 0) {
        try {
          let minLon = 180, minLat = 90, maxLon = -180, maxLat = -90;
          filteredData.features.forEach((f) => {
            const [lon, lat] = (f.geometry as any).coordinates as [number, number];
            if (lon < minLon) minLon = lon;
            if (lat < minLat) minLat = lat;
            if (lon > maxLon) maxLon = lon;
            if (lat > maxLat) maxLat = lat;
          });
          const bounds = new maplibregl.LngLatBounds([minLon, minLat], [maxLon, maxLat]);
          map.fitBounds(bounds, { padding: 64, maxZoom: 5, duration: 0 });
        } catch {}
      }
    });

    return () => {
      if (pulseRef.current) window.clearInterval(pulseRef.current);
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [loading, geoData, filteredData]);

  // Update source data when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    (['positive','neutral','negative','unknown'] as Thought["sentiment"][]).forEach((s) => {
      const src = map.getSource(`thoughts-${s}`) as any;
      if (src) src.setData(groupedData[s]);
    });
  }, [groupedData]);

  // UI state for modal + inspector
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Thought[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);

  const openFromThought = (t: Thought) => {
    const idx = parseInt(t.id, 10);
    const row = rawRows[idx];
    if (row) {
      setSelectedRow(row);
      setDrawerOpen(true);
    }
  };

  const visibleRows = useMemo(() => {
    if (!filteredData) return [] as Record<string, any>[];
    const ids = new Set(filteredData.features.map(f => parseInt(f.properties.id, 10)));
    return rawRows.filter((_, idx) => ids.has(idx));
  }, [filteredData, rawRows]);

  const sentimentsAll: Thought["sentiment"][] = ["positive", "neutral", "negative", "unknown"];

  const toggleSentiment = (s: Thought["sentiment"]) => {
    setFilters(prev => {
      const next = new Set(prev.sentiments);
      if (next.has(s)) next.delete(s); else next.add(s);
      return { ...prev, sentiments: next };
    });
  };


  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading BC sentiment data...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Voices Across Canada</h1>
            <p className="text-muted-foreground">Explore public sentiment across Canada through interactive data visualization.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 space-y-4">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Filters</h2>
                <Separator className="mb-3" />
                <DataFilters
                  sentiments={sentimentsAll}
                  selectedSentiments={filters.sentiments}
                  onToggleSentiment={toggleSentiment}
                />
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-2">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-positive"></div>
                    <span>Positive sentiment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neutral"></div>
                    <span>Neutral sentiment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-negative"></div>
                    <span>Negative sentiment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                    <span>Unknown sentiment</span>
                  </div>
                </div>
              </Card>
            </aside>

            <div className="lg:col-span-3">
              <div className={cn("relative w-full h-[75vh] rounded-lg shadow-lg overflow-hidden")}
                   ref={mapContainer}
                   aria-label="Interactive BC sentiment map"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Click clusters to explore thoughts • Hover individual dots for details
              </p>
            </div>
          </div>
        </section>

        <DatasetSummaries rows={visibleRows} />

        <ClusterModal open={modalOpen} onOpenChange={setModalOpen} thoughts={modalData} onSelect={openFromThought} />
        <EntryDrawer open={drawerOpen} onOpenChange={setDrawerOpen} row={selectedRow} />
      </main>
      <Footer />
    </>
  );
};

export default DataSetMap;
