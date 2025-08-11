
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  body_md: string;
  is_active: boolean;
  scope: string;
  send_instructions: string | null;
  created_at: string;
  updated_at: string;
};

export type MP = {
  id: string;
  full_name: string;
  email: string | null;
  riding_name: string;
  province: string;
  population: number;
  is_current: boolean;
};

export type Support = {
  id: string;
  campaign_id: string;
  mp_id: string;
  display_name: string | null;
  comment: string;
  is_public: boolean;
  created_at: string;
};

export const useActiveCampaign = () =>
  useQuery({
    queryKey: ["letters", "activeCampaign"],
    queryFn: async (): Promise<Campaign | null> => {
      const { data, error } = await supabase
        .from("letter_campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? (data[0] as unknown as Campaign) : null;
    },
  });

export const useMPs = () =>
  useQuery({
    queryKey: ["letters", "mps"],
    queryFn: async (): Promise<MP[]> => {
      const { data, error } = await supabase
        .from("mps")
        .select("id, full_name, email, riding_name, province, population, is_current")
        .eq("is_current", true);

      if (error) throw error;
      return (data as unknown as MP[]) ?? [];
    },
  });

export const useSupports = (campaignId?: string) =>
  useQuery({
    queryKey: ["letters", "supports", campaignId],
    enabled: !!campaignId,
    queryFn: async (): Promise<Support[]> => {
      const { data, error } = await supabase
        .from("letter_supports")
        .select("id, campaign_id, mp_id, display_name, comment, is_public, created_at")
        .eq("campaign_id", campaignId!);

      if (error) throw error;
      return (data as unknown as Support[]) ?? [];
    },
  });

export const useFeaturedThoughtCategorySummary = () =>
  useQuery({
    queryKey: ["letters", "featuredThoughtsSummary"],
    queryFn: async (): Promise<{ category: string; count: number }[]> => {
      // Only featured thoughts are publicly readable per RLS
      const { data, error } = await supabase
        .from("thoughts_submissions")
        .select("category")
        .eq("featured", true);

      if (error) throw error;
      if (!data) return [];

      const counts = new Map<string, number>();
      for (const row of data as { category: string }[]) {
        const cat = row.category || "Uncategorized";
        counts.set(cat, (counts.get(cat) || 0) + 1);
      }

      const arr = Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
      arr.sort((a, b) => b.count - a.count);
      return arr.slice(0, 5);
    },
  });
