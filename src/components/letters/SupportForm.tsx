
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MP } from "@/hooks/useLettersData";

type Props = {
  campaignId: string;
  mps: MP[];
  onSubmitted?: () => void;
};

const SupportForm: React.FC<Props> = ({ campaignId, mps, onSubmitted }) => {
  const { toast } = useToast();
  const [mpId, setMpId] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [provinceFilter, setProvinceFilter] = useState<string>("");

  const provinces = useMemo(() => {
    const set = new Set(mps.map((m) => m.province));
    return Array.from(set).sort();
  }, [mps]);

  const filteredMPs = useMemo(() => {
    return provinceFilter ? mps.filter((m) => m.province === provinceFilter) : mps;
  }, [mps, provinceFilter]);

  const canSubmit = mpId && comment.trim().length >= 10 && comment.trim().length <= 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast({
        title: "Please complete the form",
        description: "Choose an MP and add a brief 1–2 sentence comment (10–500 characters).",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const payload = {
      campaign_id: campaignId,
      mp_id: mpId,
      display_name: displayName.trim() || null,
      comment: comment.trim(),
      is_public: true,
    };

    const { error } = await supabase.from("letter_supports").insert([payload]);

    if (error) {
      console.error("Support insert error:", error);
      toast({
        title: "Could not submit support",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thanks for your support!",
        description: "Your comment has been recorded.",
      });
      setMpId("");
      setDisplayName("");
      setComment("");
      if (onSubmitted) onSubmitted();
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-gray-700">Province</Label>
        <Select value={provinceFilter} onValueChange={setProvinceFilter}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Filter by province (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All provinces</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-gray-700">Select your MP / Riding</Label>
        <Select value={mpId} onValueChange={setMpId}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Choose an MP and riding" />
          </SelectTrigger>
          <SelectContent>
            {filteredMPs.map((mp) => (
              <SelectItem key={mp.id} value={mp.id}>
                {mp.province} — {mp.riding_name} ({mp.full_name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="displayName" className="text-gray-700">Display name (optional)</Label>
        <Input
          id="displayName"
          placeholder="How should we show your support? (e.g., Sam from Burnaby)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="comment" className="text-gray-700">Your brief comment</Label>
        <Textarea
          id="comment"
          placeholder="Share 1–2 sentences you want included."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[96px]"
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">{comment.length}/500</div>
      </div>

      <Button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Support this letter"}
      </Button>
    </form>
  );
};

export default SupportForm;
