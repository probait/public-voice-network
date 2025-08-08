import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Thought {
  id: string;
  text: string;
  location: string;
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  category?: string;
  date?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thoughts: Thought[];
  onSelect?: (t: Thought) => void;
}

const Explosion: React.FC = () => {
  // Simple ephemeral explosion dots
  const dots = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    x: (Math.random() * 120 - 60),
    y: (Math.random() * 80 - 40),
    d: 6 + Math.random() * 6,
    delay: Math.random() * 100,
  }));
  return (
    <div className="relative h-20 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {dots.map((d) => (
          <span
            key={d.id}
            style={{
              transform: `translate(${d.x}px, ${d.y}px)`,
              width: d.d,
              height: d.d,
              transition: "transform 420ms ease-out, opacity 500ms ease-out",
            }}
            className="rounded-full bg-primary/60 opacity-0 animate-[fade-in_0.3s_ease-out_forwards]"
          />
        ))}
      </div>
    </div>
  );
};

const ClusterModal: React.FC<Props> = ({ open, onOpenChange, thoughts, onSelect }) => {
  const [phase, setPhase] = useState<"explode" | "list">("explode");

  useEffect(() => {
    if (open) {
      setPhase("explode");
      const t = setTimeout(() => setPhase("list"), 450);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cluster Details</DialogTitle>
        </DialogHeader>
        {phase === "explode" ? (
          <Explosion />
        ) : (
          <div>
            <Separator className="mb-3" />
            <ScrollArea className="h-[50vh] pr-4">
              <ul className="space-y-4">
                {thoughts.map((t) => (
                  <li key={t.id} className="p-3 rounded-md bg-muted/40">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t.location} • <span className="capitalize">{t.sentiment}</span>{t.category ? ` • ${t.category}` : ""}
                    </div>
                    <div className="text-sm leading-relaxed">{t.text}</div>
                    {typeof onOpenChange === 'function' && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          className="text-xs font-medium underline underline-offset-2 text-primary hover:opacity-90"
                          onClick={() => {
                            onOpenChange(false);
                            onSelect?.(t);
                          }}
                        >
                          View full response
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClusterModal;
