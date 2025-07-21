import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionCard from "./SubmissionCard";
import { useFeaturedThoughts } from "@/hooks/useFeaturedThoughts";
import { useTotalThoughtsCount } from "@/hooks/useTotalThoughtsCount";

const SubmissionsFeed = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: submissions = [], isLoading } = useFeaturedThoughts();
  const { data: totalCount = 0, isLoading: countLoading } = useTotalThoughtsCount();

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
                <SubmissionCard
                  key={submission.id}
                  name={submission.name}
                  province={submission.province}
                  category={submission.category}
                  subject={submission.subject}
                  message={submission.message}
                  timeAgo={formatTimeAgo(submission.created_at)}
                />
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
    </div>
  );
};

export default SubmissionsFeed;