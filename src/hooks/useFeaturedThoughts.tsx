import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedThought {
  id: string;
  name: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  created_at: string;
}

export const useFeaturedThoughts = () => {
  return useQuery({
    queryKey: ["featuredThoughts"],
    queryFn: async (): Promise<FeaturedThought[]> => {
      // Use the new secure view instead of direct table access
      const { data, error } = await supabase
        .from("featured_thoughts_safe")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};