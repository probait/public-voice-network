
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useMeetupAttendance = (refetch: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendingMeetups, setAttendingMeetups] = useState<Set<string>>(new Set());

  const handleAttendance = async (meetupId: string, isAttending: boolean) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join meetups.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isAttending) {
        // Remove attendance
        const { error } = await supabase
          .from('attendees')
          .delete()
          .eq('meetup_id', meetupId)
          .eq('user_id', user.id);

        if (error) throw error;

        setAttendingMeetups(prev => {
          const newSet = new Set(prev);
          newSet.delete(meetupId);
          return newSet;
        });

        toast({
          title: "Left meetup",
          description: "You're no longer attending this meetup."
        });
      } else {
        // Add attendance
        const { error } = await supabase
          .from('attendees')
          .insert({
            meetup_id: meetupId,
            user_id: user.id
          });

        if (error) throw error;

        setAttendingMeetups(prev => new Set(prev).add(meetupId));

        toast({
          title: "Joined meetup!",
          description: "You're now attending this meetup."
        });
      }

      refetch();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Error",
        description: "There was an error updating your attendance.",
        variant: "destructive"
      });
    }
  };

  return {
    attendingMeetups,
    handleAttendance
  };
};
