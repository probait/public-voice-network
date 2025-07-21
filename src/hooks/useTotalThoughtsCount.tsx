import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTotalThoughtsCount = () => {
  return useQuery({
    queryKey: ["totalThoughtsCount"],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("thoughts_submissions")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};