import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { Map, MapLayerMouseEvent, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Papa from "papaparse";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataFilters from "@/components/map/DataFilters";
import ClusterModal from "@/components/map/ClusterModal";

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
  categories: Set<string>;
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
};

// Heuristic helpers
const normalize = (s: unknown) => (typeof s === "string" ? s.trim() : "");

const detectSentiment = (row: Record<string, any>): Thought["sentiment"] => {
  // Try common patterns
  for (const key of Object.keys(row)) {
    const lk = key.toLowerCase();
    if (lk.includes("sentiment")) {
      const v = String(row[key]).toLowerCase();
      if (["pos", "positive", "1", "true"].includes(v)) return "positive";
      if (["neg", "negative", "-1"].includes(v)) return "negative";
      if (["neutral", "0"].includes(v)) return "neutral";
    }
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
  return { type: "FeatureCollection", features };
};

const CANONICAL_URL = "/dataset-map";

const DataSetMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const pulseRef = useRef<number>(0);

  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, Thought> | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    sentiments: new Set(["positive", "neutral", "negative", "unknown"]),
    categories: new Set(),
  });
  const [token, setToken] = useState<string>(() => localStorage.getItem("mapbox_token") || "");
  const [overlayUrl, setOverlayUrl] = useState<string>(() => localStorage.getItem("bc_overlay_url") || "");

  const filteredData = useMemo(() => {
    if (!geoData) return geoData;
    const features = geoData.features.filter(f => {
      const sOk = filters.sentiments.has(f.properties.sentiment);
      const cOk = filters.categories.size === 0 || (f.properties.category && filters.categories.has(f.properties.category));
      return sOk && cOk;
    });
    return { type: "FeatureCollection", features } as GeoJSON.FeatureCollection<GeoJSON.Point, Thought>;
  }, [geoData, filters]);

  useEffect(() => {
    // SEO basics
    document.title = "DataSet Map – BC Sentiment Visualization";
    const desc = "Interactive BC sentiment map with clustering, filters, and storytelling.";
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
        // Derive categories
        const cats = Array.from(new Set(gj.features.map(f => f.properties.category).filter(Boolean) as string[])).sort();
        setAvailableCategories(cats);
      },
      error: (err) => {
        console.error("CSV parse error", err);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-123.5, 49.8],
      zoom: 4.6,
      projection: "globe",
      pitch: 45,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Atmosphere
      map.setFog({
        color: "rgb(255,255,255)",
        "high-color": "rgb(200,200,225)",
        "horizon-blend": 0.2,
      });

      // Optional overlay image if provided
      if (overlayUrl) {
        try {
          map.addSource("bc-overlay", {
            type: "image",
            url: overlayUrl,
            coordinates: [
              [-139.06, 60.0], // top-left
              [-114.02, 60.0], // top-right
              [-114.02, 48.3], // bottom-right
              [-139.06, 48.3], // bottom-left
            ],
          } as any);
          map.addLayer({
            id: "bc-overlay-layer",
            type: "raster",
            source: "bc-overlay",
            paint: { "raster-opacity": 0.7 },
          }, "waterway-label");
        } catch (e) {
          console.warn("Overlay add failed", e);
        }
      }

      // Add data source when available
      if (filteredData) {
        map.addSource("thoughts", {
          type: "geojson",
          data: filteredData,
          cluster: true,
          clusterRadius: 50,
          clusterProperties: {
            sumPositive: ["+", ["case", ["==", ["get", "sentiment"], "positive"], 1, 0]],
            sumNeutral: ["+", ["case", ["==", ["get", "sentiment"], "neutral"], 1, 0]],
            sumNegative: ["+", ["case", ["==", ["get", "sentiment"], "negative"], 1, 0]],
          },
        } as any);

        // Cluster circles
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "thoughts",
          filter: ["has", "point_count"],
          paint: {
            // Soft edges
            "circle-blur": 0.6,
            // Radius is animated later
            "circle-radius": ["interpolate", ["linear"], ["get", "point_count"], 2, 14, 50, 22, 200, 28],
            // Color by majority sentiment
            "circle-color": [
              "case",
              [">=", ["get", "sumPositive"], ["max", ["get", "sumNeutral"], ["get", "sumNegative"]]], "hsl(150, 60%, 45%)",
              [">=", ["get", "sumNegative"], ["max", ["get", "sumNeutral"], ["get", "sumPositive"]]], "hsl(0, 70%, 55%)",
              "hsl(40, 85%, 55%)"
            ],
            "circle-opacity": 0.8,
            "circle-stroke-color": "hsl(0, 0%, 100%)",
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.3,
          },
        });

        // Cluster count labels
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "thoughts",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-size": 12,
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
          },
          paint: {
            "text-color": "hsl(0, 0%, 10%)",
            "text-halo-color": "hsl(0, 0%, 100%)",
            "text-halo-width": 1.2,
          }
        });

        // Individual points
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "thoughts",
          filter: ["!has", "point_count"],
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "match",
              ["get", "sentiment"],
              "positive", "hsl(150, 60%, 45%)",
              "negative", "hsl(0, 70%, 55%)",
              "neutral", "hsl(40, 85%, 55%)",
              /* other */ "hsl(220, 10%, 60%)"
            ],
            "circle-opacity": 0.9,
            "circle-blur": 0.4,
            "circle-stroke-color": "hsl(0, 0%, 100%)",
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.5,
          },
        });

        // Hover tooltip
        popupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
        map.on("mousemove", "unclustered-point", (e: MapLayerMouseEvent) => {
          const f = e.features?.[0] as GeoFeature | undefined;
          if (!f) return;
          const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
          const { text, location, sentiment } = f.properties;
          const content = `<div style="max-width:280px"><strong>${location}</strong><br/><em>${sentiment}</em><br/><div style="margin-top:4px">${text.replaceAll("\\\"", "&quot;")}</div></div>`;
          popupRef.current!.setLngLat(coords).setHTML(content).addTo(map);
        });
        map.on("mouseleave", "unclustered-point", () => {
          popupRef.current?.remove();
        });

        // Click cluster to open modal
        map.on("click", "clusters", async (e: MapLayerMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
          const clusterId = features[0]?.properties?.cluster_id;
          const src = map.getSource("thoughts") as any;
          if (!src || clusterId == null) return;
          src.getClusterLeaves(clusterId, 100, 0, (err: any, leaves: GeoFeature[]) => {
            if (err) return;
            setModalData(leaves.map(l => l.properties));
            setModalOpen(true);
            // Fancy fly-to
            const coords = (features[0].geometry as any).coordinates as [number, number];
            map.easeTo({ center: coords, duration: 600, zoom: Math.min(map.getZoom() + 1.2, 9) });
          });
        });

        // Pulse animation for clusters (gentle radius breathing)
        let grow = true;
        pulseRef.current = window.setInterval(() => {
          const layerId = "clusters";
          const cur = map.getPaintProperty(layerId, "circle-radius") as any;
          if (!cur) return;
          const delta = 0.6;
          const factor = grow ? 1 + 0.04 : 1 - 0.04;
          const next = ["*", cur, factor];
          try {
            map.setPaintProperty(layerId, "circle-radius", next as any);
            grow = !grow && Math.random() > 0.5 ? false : !grow ? true : false; // keep it subtle
          } catch { }
        }, 900);
      }
    });

    return () => {
      if (pulseRef.current) window.clearInterval(pulseRef.current);
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [token, overlayUrl, filteredData]);

  // Update source data when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getSource("thoughts")) return;
    (map.getSource("thoughts") as any).setData(filteredData);
  }, [filteredData]);

  // UI state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Thought[]>([]);

  const sentimentsAll: Thought["sentiment"][] = ["positive", "neutral", "negative", "unknown"];

  const toggleSentiment = (s: Thought["sentiment"]) => {
    setFilters(prev => {
      const next = new Set(prev.sentiments);
      if (next.has(s)) next.delete(s); else next.add(s);
      return { ...prev, sentiments: next };
    });
  };

  const toggleCategory = (c: string) => {
    setFilters(prev => {
      const next = new Set(prev.categories);
      if (next.has(c)) next.delete(c); else next.add(c);
      return { ...prev, categories: next };
    });
  };

  const handleSaveToken = () => {
    localStorage.setItem("mapbox_token", token);
    // Re-initialize map if needed
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    // Trigger effect by setting state (already updated)
  };

  const handleSaveOverlay = () => {
    localStorage.setItem("bc_overlay_url", overlayUrl);
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">DataSet Map – BC Sentiment</h1>
          <p className="text-muted-foreground">Explore public sentiment across British Columbia with interactive clustering, filters, and storytelling overlays.</p>
        </header>

        {/* Config inputs (token and overlay) */}
        <Card className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="token">Mapbox Public Token</Label>
            <div className="flex gap-2 mt-1">
              <Input id="token" placeholder="pk.eyJ..." value={token} onChange={(e) => setToken(e.target.value)} />
              <Button onClick={handleSaveToken}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Store your Mapbox public token locally. You can find it in your Mapbox dashboard.</p>
          </div>
          <div>
            <Label htmlFor="overlay">BC Overlay PNG (optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input id="overlay" placeholder="/lovable-uploads/your-bc-map.png" value={overlayUrl} onChange={(e) => setOverlayUrl(e.target.value)} />
              <Button onClick={handleSaveOverlay}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Provide a transparent PNG URL to overlay on the basemap.</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Filters</h2>
              <Separator className="mb-3" />
              <DataFilters
                sentiments={sentimentsAll}
                selectedSentiments={filters.sentiments}
                onToggleSentiment={toggleSentiment}
                categories={availableCategories}
                selectedCategories={filters.categories}
                onToggleCategory={toggleCategory}
              />
            </Card>
          </aside>

          <div className="lg:col-span-3">
            {!token ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Enter your Mapbox public token above to load the interactive map.</p>
              </Card>
            ) : (
              <div className={cn("relative w-full h-[70vh] rounded-lg shadow", !geoData && "animate-pulse")}
                   ref={mapContainer}
                   aria-label="Interactive BC sentiment map"
              />
            )}
          </div>
        </div>
      </section>

      <ClusterModal open={modalOpen} onOpenChange={setModalOpen} thoughts={modalData} />
    </main>
  );
};

export default DataSetMap;
