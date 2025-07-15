import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PartnershipInquiryData {
  organization_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  organization_type: string;
  message: string;
}

export const usePartnershipInquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitInquiry = async (data: PartnershipInquiryData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('partnership_inquiries')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Partnership inquiry sent!",
        description: "Thank you for your interest in partnering with us. We'll be in touch soon.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting partnership inquiry:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitInquiry,
    isSubmitting
  };
};