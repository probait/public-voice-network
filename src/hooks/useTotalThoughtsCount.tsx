import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTotalThoughtsCount = () => {
  return useQuery({
    queryKey: ["totalThoughtsCount"],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .rpc("get_total_thoughts_count");

      if (error) {
        throw error;
      }

      const n = typeof data === "number" ? data : Number(data ?? 0);
      return Number.isFinite(n) ? n : 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};