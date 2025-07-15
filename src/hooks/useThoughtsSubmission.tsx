import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ThoughtsSubmissionData {
  name: string;
  email: string;
  province: string;
  category: string;
  subject: string;
  message: string;
}

export const useThoughtsSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitThoughts = async (data: ThoughtsSubmissionData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Submission received!",
        description: "Thank you for sharing your thoughts. Your submission has been recorded and will be reviewed by our team.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting thoughts:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your thoughts. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitThoughts,
    isSubmitting
  };
};