import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterSettings {
  popup_enabled: boolean;
  popup_delay_seconds: number;
  popup_frequency_days: number;
}

export function useNewsletterPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState<NewsletterSettings | null>(null);

  useEffect(() => {
    const checkPopupSettings = async () => {
      try {
        // Get newsletter settings
        const { data: settingsData, error } = await supabase
          .from("newsletter_settings")
          .select("popup_enabled, popup_delay_seconds, popup_frequency_days")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching newsletter settings:", error);
          return;
        }

        setSettings(settingsData);

        // Check if popup is enabled
        if (!settingsData.popup_enabled) {
          return;
        }

        // Check if popup was recently dismissed
        const dismissedUntil = localStorage.getItem("newsletter-popup-dismissed");
        if (dismissedUntil) {
          const dismissedTime = parseInt(dismissedUntil);
          const now = Date.now();
          const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);
          
          if (daysSinceDismissed < settingsData.popup_frequency_days) {
            return;
          }
        }

        // Show popup after delay
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, settingsData.popup_delay_seconds * 1000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error checking popup settings:", error);
      }
    };

    checkPopupSettings();
  }, []);

  const hidePopup = () => {
    setShowPopup(false);
  };

  const showPopupManually = () => {
    setShowPopup(true);
  };

  return {
    showPopup,
    hidePopup,
    showPopupManually,
    settings,
  };
}