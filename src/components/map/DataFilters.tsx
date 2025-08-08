import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export type Sentiment = "positive" | "neutral" | "negative" | "unknown";

interface Props {
  sentiments: Sentiment[];
  selectedSentiments: Set<Sentiment>;
  onToggleSentiment: (s: Sentiment) => void;
}

const sentimentLabels: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  unknown: "Unknown",
};

const DataFilters: React.FC<Props> = ({
  sentiments,
  selectedSentiments,
  onToggleSentiment,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Sentiment</h3>
        <div className="space-y-2">
          {sentiments.map((s) => (
            <label key={s} className="flex items-center gap-2">
              <Checkbox checked={selectedSentiments.has(s)} onCheckedChange={() => onToggleSentiment(s)} />
              <span className="text-sm">{sentimentLabels[s]}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DataFilters;
