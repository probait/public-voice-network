import { useEffect, useRef } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

// One-time hidden importer that runs automatically on app load
// It will import public/data/voices.csv into thoughts_submissions
// Only runs if no previous bc_ai_survey_2025 rows exist
const VoicesAutoImport = () => {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        // Skip if we've already marked it done in this browser session
        if (sessionStorage.getItem("voices_import_done") === "1") return;

        // 0) Check if entries already imported
        const { count, error: countErr } = await supabase
          .from("thoughts_submissions")
          .select("id", { count: "exact", head: true })
          .eq("source", "bc_ai_survey_2025");

        if (countErr) throw countErr;
        if ((count ?? 0) > 0) {
          console.info(`[VoicesAutoImport] Skipping — already found ${count} imported rows.`);
          sessionStorage.setItem("voices_import_done", "1");
          return;
        }

        // 1) Fetch CSV from public folder
        const res = await fetch("/data/voices.csv");
        if (!res.ok) throw new Error("Failed to load voices.csv");
        const csvText = await res.text();

        // 2) Parse CSV
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const rows = (parsed.data as any[]).filter(Boolean);
        const total = rows.length;
        if (total === 0) {
          console.warn("[VoicesAutoImport] voices.csv contained 0 rows");
          sessionStorage.setItem("voices_import_done", "1");
          return;
        }

        console.info(`[VoicesAutoImport] Starting import of ${total} rows…`);

        const get = (row: Record<string, any>, keys: string[], fallback = ""): string => {
          for (const k of keys) {
            const v = row[k];
            if (typeof v === "string" && v.trim()) return v.trim();
            if (typeof v === "number") return String(v);
          }
          return fallback;
        };

        // Build payloads
        const SOURCE = "bc_ai_survey_2025";
        const payload = rows.map((row, idx) => {
          const participantId = get(row, [
            "participant_id",
            "ParticipantID",
            "Participant Id",
            "Participant ID",
          ], `row-${idx + 1}`);

          const region = get(row, [
            "Q1_Location_in_BC",
            "Location in BC",
            "region",
            "Region",
            "BC Region",
          ], "");

          const name = region ? `Resident, ${region}` : "BC Resident";

          // Choose first positive sector as category, fallback to general
          const posKeys = [
            "Q4A_Sector_AI_making_a_positive_impact_1",
            "Q4A_Sector_AI_making_a_positive_impact_2",
            "Q4A_Sector_AI_making_a_positive_impact_3",
            "Q4A_Sector_AI_making_a_positive_impact_4",
            "Q4A_Sector_AI_making_a_positive_impact_5",
            "Q4A_Sector_AI_making_a_positive_impact_6",
            "Q4A_Sector_AI_making_a_positive_impact_7",
          ];
          const categoryRaw = get(row, ["category", "Category", ...posKeys], "general");
          const category = (categoryRaw || "general").toLowerCase();

          const feeling = get(row, ["Q3_AI_affecting_society_feeling"], "");
          const subject = `Citizen Voice: ${region || "BC"}${feeling ? ` — ${feeling}` : ""}`;

          const textCandidatesKeys = [
            // Q8
            "Q8_AI_helping_BC_community_text_OE",
            "Q8_AI_helping_BC_community_video_OE_transcription",
            // Q13
            "Q13_AI_impact_worries_text_OE",
            "Q13_AI_impact_worries_videos_OE_transcription",
            // Q16
            "Q16_Indigenous_communities_involvement_AI_text_OE",
            "Q16_Indigenous_communities_involvement_AI_video_OE_transcription",
            // Q17
            "Q17_Advice_BC_Leaders_text_OE",
            "Q17_Advice_BC_Leaders_video_OE_transcription",
          ];
          const textPieces = textCandidatesKeys
            .map(k => (row as any)[k])
            .filter(v => typeof v === "string" && v.trim().length > 0) as string[];
          const message = textPieces.length > 0
            ? textPieces.join("\n\n")
            : `Voice imported from the BC AI Survey. Region: ${region || "N/A"}.`;

          return {
            name,
            email: "",
            province: "BC",
            category,
            subject,
            message,
            source: SOURCE,
            source_participant_id: participantId,
            region: region || null,
          };
        });

        // 3) Upsert in batches
        let inserted = 0;
        let updated = 0;
        const BATCH_SIZE = 200;

        // Preload existing ids for accurate counts
        const { data: existingRows, error: existingErr } = await supabase
          .from("thoughts_submissions")
          .select("source_participant_id")
          .eq("source", SOURCE)
          .not("source_participant_id", "is", null);
        if (existingErr) throw existingErr;
        const existing = new Set<string>((existingRows || []).map((r: any) => r.source_participant_id));

        for (let i = 0; i < payload.length; i += BATCH_SIZE) {
          const batch = payload.slice(i, i + BATCH_SIZE);
          const newCount = batch.filter(b => !existing.has(b.source_participant_id)).length;
          const updCount = batch.length - newCount;

          const { error: upsertErr } = await supabase
            .from("thoughts_submissions")
            .upsert(batch, { onConflict: "source,source_participant_id" });
          if (upsertErr) throw upsertErr;

          inserted += newCount;
          updated += updCount;
          batch.forEach(b => existing.add(b.source_participant_id));
          console.info(`[VoicesAutoImport] Progress: ${Math.min(i + BATCH_SIZE, payload.length)}/${payload.length}`);
        }

        console.info(`[VoicesAutoImport] Done. Inserted: ${inserted}, Updated: ${updated}`);
        sessionStorage.setItem("voices_import_done", "1");
      } catch (e) {
        console.error("[VoicesAutoImport] Error:", e);
        // Do not block the UI
        sessionStorage.setItem("voices_import_done", "1");
      }
    };

    run();
  }, []);

  return null;
};

export default VoicesAutoImport;
