import { useEffect, useRef, useState } from "react";
import SubmissionCard from "./SubmissionCard";
import { useFeaturedThoughts } from "@/hooks/useFeaturedThoughts";
import { useTotalThoughtsCount } from "@/hooks/useTotalThoughtsCount";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const SubmissionsFeed = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: submissions = [], isLoading } = useFeaturedThoughts();
  const { data: totalCount = 0, isLoading: countLoading } = useTotalThoughtsCount();

  type Submission = {
    id: string;
    name: string;
    province: string;
    category: string;
    subject: string;
    message: string;
    created_at: string;
  };

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += 1;
      }
    };

    const interval = setInterval(scroll, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="h-80 w-full rounded-md overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-scroll scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="p-1">
            {isLoading ? (
              <div className="text-center text-white/70 py-4">Loading voices...</div>
            ) : (
              submissions.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => { setSelectedSubmission(submission); setIsOpen(true); }}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  aria-label={`View full voice from ${submission.name} about ${submission.subject}`}
                >
                  <SubmissionCard
                    name={submission.name}
                    province={submission.province}
                    category={submission.category}
                    subject={submission.subject}
                    message={submission.message}
                    timeAgo={formatTimeAgo(submission.created_at)}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Voices Count Metric */}
      <div className="mt-3 text-center">
        <div className="text-white/90 text-sm">
          {countLoading ? (
            <span className="text-white/70">Loading count...</span>
          ) : (
            <>
              <span className="font-semibold text-lg">{totalCount.toLocaleString()}</span>
              <span className="ml-1">Canadians have shared their thoughts</span>
            </>
          )}
        </div>
      </div>

      {/* Modal for full submission */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedSubmission(null)
        }}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
          >
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            {selectedSubmission && (
              <div>
                <div className="mb-1">
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {selectedSubmission.subject}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.name} • {selectedSubmission.province} • {formatTimeAgo(selectedSubmission.created_at)}
                  </p>
                </div>
                <div className="mb-2">
                  <span className="inline-block rounded px-2 py-1 text-xs font-medium bg-muted text-foreground/80">
                    {selectedSubmission.category.charAt(0).toUpperCase() + selectedSubmission.category.slice(1)}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default SubmissionsFeed;