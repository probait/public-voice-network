
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionCard from "./SubmissionCard";

const SubmissionsFeed = () => {
  // Mock data for now - this will be replaced with real data from Supabase later
  const mockSubmissions = [
    {
      id: 1,
      name: "Sarah Chen",
      province: "BC",
      category: "healthcare",
      subject: "AI in Rural Healthcare Access",
      message: "I'm concerned about how AI might worsen healthcare disparities in rural BC. While AI diagnostics could help, we need to ensure rural communities aren't left behind in this technological shift.",
      timeAgo: "2h"
    },
    {
      id: 2,
      name: "Marcus Thompson",
      province: "ON",
      category: "employment",
      subject: "Manufacturing Job Concerns",
      message: "Working in auto manufacturing for 15 years, I see AI automation coming fast. We need retraining programs and policies that protect workers while embracing innovation.",
      timeAgo: "4h"
    },
    {
      id: 3,
      name: "Dr. Amélie Dubois",
      province: "QC",
      category: "education",
      subject: "AI Literacy in Schools",
      message: "As an educator, I believe we must teach students about AI ethics and critical thinking. Quebec needs comprehensive AI education policies to prepare our youth.",
      timeAgo: "6h"
    },
    {
      id: 4,
      name: "James Running Bear",
      province: "AB",
      category: "privacy",
      subject: "Indigenous Data Sovereignty",
      message: "AI systems must respect Indigenous data sovereignty. We need policies ensuring our communities control how AI uses data about our lands and peoples.",
      timeAgo: "8h"
    },
    {
      id: 5,
      name: "Elena Rodriguez",
      province: "NS",
      category: "economy",
      subject: "Small Business AI Impact",
      message: "As a small business owner, I'm excited about AI tools but worried about costs and complexity. We need support programs to help Maritime businesses adopt AI responsibly.",
      timeAgo: "10h"
    },
    {
      id: 6,
      name: "David Kim",
      province: "MB",
      category: "ethics",
      subject: "AI Bias in Hiring",
      message: "I've seen AI hiring tools discriminate against qualified candidates. Manitoba needs strong anti-bias regulations for AI in employment decisions.",
      timeAgo: "12h"
    },
    {
      id: 7,
      name: "Rachel Morrison",
      province: "SK",
      category: "regulation",
      subject: "Agricultural AI Governance",
      message: "Precision agriculture AI is transforming farming, but we need clear data ownership rules. Saskatchewan farmers should control their land and crop data.",
      timeAgo: "14h"
    },
    {
      id: 8,
      name: "Alex Petrov",
      province: "NL",
      category: "other",
      subject: "AI and Climate Change",
      message: "Living in a coastal community, I see climate impacts daily. AI could help with predictions and adaptation, but we need green AI policies to reduce energy consumption.",
      timeAgo: "16h"
    }
  ];

  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 p-4">
          {mockSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              name={submission.name}
              province={submission.province}
              category={submission.category}
              subject={submission.subject}
              message={submission.message}
              timeAgo={submission.timeAgo}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SubmissionsFeed;
