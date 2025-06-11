
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmissionCard from "./SubmissionCard";

const SubmissionsFeed = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    },
    {
      id: 9,
      name: "Marie Laforge",
      province: "NB",
      category: "healthcare",
      subject: "Telehealth AI Solutions",
      message: "Rural New Brunswick could benefit from AI-powered telehealth, but we need reliable internet infrastructure first. Technology without access is meaningless.",
      timeAgo: "18h"
    },
    {
      id: 10,
      name: "Priya Sharma",
      province: "ON",
      category: "employment",
      subject: "Tech Sector Opportunities",
      message: "As a software developer in Toronto, I see AI creating new jobs while eliminating others. We need targeted training programs for displaced workers.",
      timeAgo: "20h"
    },
    {
      id: 11,
      name: "Robert MacLeod",
      province: "PE",
      category: "economy",
      subject: "Tourism Industry Changes",
      message: "AI chatbots are changing how we serve tourists on PEI. While efficient, we must preserve the personal touch that makes Maritime hospitality special.",
      timeAgo: "22h"
    },
    {
      id: 12,
      name: "Chen Wei",
      province: "BC",
      category: "education",
      subject: "Student Data Protection",
      message: "My children's school uses AI learning platforms. I worry about their data privacy and how algorithms might bias their educational paths.",
      timeAgo: "1d"
    },
    {
      id: 13,
      name: "Anna Kowalski",
      province: "AB",
      category: "ethics",
      subject: "Energy Sector Automation",
      message: "AI optimization in oil and gas increases efficiency but threatens traditional jobs. Alberta needs a just transition plan for energy workers.",
      timeAgo: "1d"
    },
    {
      id: 14,
      name: "Dr. Michael Bear",
      province: "YT",
      category: "privacy",
      subject: "Northern Data Centers",
      message: "The North's strategic location for data centers brings opportunities, but we must ensure Indigenous communities benefit and control their data sovereignty.",
      timeAgo: "1d"
    },
    {
      id: 15,
      name: "Lisa Trudeau",
      province: "QC",
      category: "regulation",
      subject: "French Language AI",
      message: "AI systems must support French language properly. Quebec needs policies ensuring our language isn't marginalized by English-dominant AI development.",
      timeAgo: "1d"
    },
    {
      id: 16,
      name: "Jamal Hassan",
      province: "ON",
      category: "employment",
      subject: "Gig Economy Changes",
      message: "As a rideshare driver, I see AI dispatch affecting my income. Platform workers need protection as algorithms increasingly control our work.",
      timeAgo: "1d"
    },
    {
      id: 17,
      name: "Emma Johnson",
      province: "NS",
      category: "healthcare",
      subject: "Mental Health AI",
      message: "AI therapy apps are popular with young people, but human connection remains crucial for mental health. We need balanced approaches.",
      timeAgo: "1d"
    },
    {
      id: 18,
      name: "Pierre Leblanc",
      province: "NB",
      category: "economy",
      subject: "Forestry Innovation",
      message: "AI-powered forest management could revolutionize our industry. New Brunswick should lead in sustainable forestry technology adoption.",
      timeAgo: "2d"
    },
    {
      id: 19,
      name: "Fatima Al-Rashid",
      province: "AB",
      category: "education",
      subject: "Multilingual Learning",
      message: "My children speak Arabic at home and need AI tools that respect our culture. Educational AI must serve Canada's diverse communities.",
      timeAgo: "2d"
    },
    {
      id: 20,
      name: "Tom Wilson",
      province: "MB",
      category: "other",
      subject: "Rural Internet Access",
      message: "AI promises are empty without reliable rural internet. Manitoba must prioritize connectivity before pushing AI adoption in agriculture.",
      timeAgo: "2d"
    },
    {
      id: 21,
      name: "Dr. Sarah Blackhorse",
      province: "SK",
      category: "healthcare",
      subject: "Indigenous Health Data",
      message: "AI health research must respect Indigenous knowledge systems and ensure our communities control health data collection and use.",
      timeAgo: "2d"
    },
    {
      id: 22,
      name: "Giovanni Rossi",
      province: "ON",
      category: "employment",
      subject: "Construction Automation",
      message: "AI and robotics are entering construction. As a union rep, I advocate for worker retraining and safety improvements, not just efficiency.",
      timeAgo: "2d"
    },
    {
      id: 23,
      name: "Linda Zhang",
      province: "BC",
      category: "privacy",
      subject: "Smart City Concerns",
      message: "Vancouver's smart city initiatives collect massive data. Citizens need transparency about what's collected and how AI systems use our information.",
      timeAgo: "2d"
    },
    {
      id: 24,
      name: "Ahmed Osman",
      province: "ON",
      category: "ethics",
      subject: "AI in Policing",
      message: "As a community advocate, I'm concerned about AI bias in law enforcement. We need oversight to prevent discriminatory policing algorithms.",
      timeAgo: "3d"
    },
    {
      id: 25,
      name: "Jennifer MacKinnon",
      province: "NS",
      category: "economy",
      subject: "Fishing Industry Tech",
      message: "AI can help predict fish populations and optimize routes, but traditional knowledge from generations of fishers must remain valued.",
      timeAgo: "3d"
    },
    {
      id: 26,
      name: "Dr. Raj Patel",
      province: "BC",
      category: "healthcare",
      subject: "AI Diagnostics Ethics",
      message: "AI shows promise in medical imaging, but doctors must remain central to patient care. Technology should augment, not replace, human judgment.",
      timeAgo: "3d"
    },
    {
      id: 27,
      name: "Sophie Martin",
      province: "QC",
      category: "education",
      subject: "AI Teacher Training",
      message: "Quebec teachers need training to use AI tools effectively while maintaining pedagogical excellence. Professional development is crucial.",
      timeAgo: "3d"
    },
    {
      id: 28,
      name: "Kevin O'Brien",
      province: "NL",
      category: "employment",
      subject: "Mining Industry Changes",
      message: "AI optimization in mining improves safety but reduces jobs. Newfoundland needs programs to help miners transition to new tech roles.",
      timeAgo: "3d"
    },
    {
      id: 29,
      name: "Aisha Mohammed",
      province: "ON",
      category: "regulation",
      subject: "Financial AI Oversight",
      message: "AI in banking and lending requires strong regulation to prevent bias. Newcomers to Canada shouldn't face algorithmic discrimination.",
      timeAgo: "3d"
    },
    {
      id: 30,
      name: "Daniel Sinclair",
      province: "AB",
      category: "other",
      subject: "AI Energy Consumption",
      message: "Data centers powering AI consume massive energy. Alberta should leverage renewable energy for sustainable AI infrastructure development.",
      timeAgo: "4d"
    },
    {
      id: 31,
      name: "Dr. Nayeli Gonzalez",
      province: "BC",
      category: "ethics",
      subject: "Research Ethics",
      message: "AI research must follow strict ethical guidelines. Universities need clear policies about data use and algorithmic transparency in studies.",
      timeAgo: "4d"
    },
    {
      id: 32,
      name: "Marcus Reid",
      province: "ON",
      category: "employment",
      subject: "Retail Transformation",
      message: "Self-checkout and AI inventory systems change retail work. Ontario needs policies ensuring workers aren't left behind in automation.",
      timeAgo: "4d"
    },
    {
      id: 33,
      name: "Isabelle Gagnon",
      province: "QC",
      category: "privacy",
      subject: "Social Media AI",
      message: "AI algorithms shape what content we see daily. Quebec should regulate how platforms use AI to influence public discourse.",
      timeAgo: "4d"
    },
    {
      id: 34,
      name: "William Bear Claw",
      province: "MB",
      category: "other",
      subject: "Traditional Knowledge AI",
      message: "AI systems should incorporate Indigenous knowledge respectfully. Technology must honor traditional ways of understanding our environment.",
      timeAgo: "4d"
    },
    {
      id: 35,
      name: "Dr. Helen Liu",
      province: "AB",
      category: "healthcare",
      subject: "Elderly Care AI",
      message: "AI can help monitor elderly patients, but human caregivers remain essential. Technology should enhance, not replace, compassionate care.",
      timeAgo: "5d"
    },
    {
      id: 36,
      name: "Jean-Paul Durand",
      province: "NB",
      category: "economy",
      subject: "Francophone AI Services",
      message: "AI customer service must serve francophones properly. New Brunswick businesses need bilingual AI solutions that understand Acadian French.",
      timeAgo: "5d"
    },
    {
      id: 37,
      name: "Samantha Wong",
      province: "BC",
      category: "education",
      subject: "Special Needs Support",
      message: "AI tools can help students with learning differences, but we need personalized approaches that respect each child's unique needs.",
      timeAgo: "5d"
    },
    {
      id: 38,
      name: "Tyler Jackson",
      province: "SK",
      category: "employment",
      subject: "Transportation Changes",
      message: "Autonomous vehicles threaten trucking jobs across the prairies. Saskatchewan needs retraining programs for displaced transport workers.",
      timeAgo: "5d"
    },
    {
      id: 39,
      name: "Dr. Amara Okafor",
      province: "ON",
      category: "ethics",
      subject: "Medical AI Bias",
      message: "AI diagnostic tools often show bias against minorities. Canada needs diverse datasets and testing to ensure equitable healthcare AI.",
      timeAgo: "5d"
    },
    {
      id: 40,
      name: "Robert Campbell",
      province: "NS",
      category: "regulation",
      subject: "Coastal Monitoring AI",
      message: "AI helps monitor coastal erosion and fisheries, but data sharing between provinces needs coordination for effective environmental protection.",
      timeAgo: "6d"
    },
    {
      id: 41,
      name: "Maya Patel",
      province: "BC",
      category: "privacy",
      subject: "Workplace Surveillance",
      message: "AI monitoring of remote workers raises privacy concerns. British Columbia should protect employee rights in the digital workplace.",
      timeAgo: "6d"
    },
    {
      id: 42,
      name: "François Bouchard",
      province: "QC",
      category: "other",
      subject: "Cultural AI Preservation",
      message: "AI should help preserve Quebecois culture and traditions. Technology must serve cultural diversity, not homogenize it.",
      timeAgo: "6d"
    },
    {
      id: 43,
      name: "Dr. Susan Littlechild",
      province: "AB",
      category: "education",
      subject: "Indigenous STEM",
      message: "AI education must include Indigenous perspectives on technology and ethics. Alberta schools should integrate traditional knowledge with modern tech.",
      timeAgo: "6d"
    },
    {
      id: 44,
      name: "Carlos Santos",
      province: "ON",
      category: "employment",
      subject: "Food Service Automation",
      message: "AI ordering systems change restaurant work. Ontario needs policies ensuring fair wages and job security as the industry transforms.",
      timeAgo: "6d"
    },
    {
      id: 45,
      name: "Dr. Patricia Morrison",
      province: "PE",
      category: "healthcare",
      subject: "Island Healthcare AI",
      message: "Small populations benefit from AI connecting to mainland specialists. PEI should lead in rural-urban healthcare AI integration.",
      timeAgo: "7d"
    },
    {
      id: 46,
      name: "Hassan Ali",
      province: "MB",
      category: "economy",
      subject: "Immigrant Integration",
      message: "AI translation tools help newcomers navigate services, but human support remains crucial for successful integration into Canadian society.",
      timeAgo: "7d"
    },
    {
      id: 47,
      name: "Jennifer White Eagle",
      province: "SK",
      category: "ethics",
      subject: "Land Rights AI",
      message: "AI land use planning must respect treaty rights and traditional territories. Technology decisions should include Indigenous nations as partners.",
      timeAgo: "7d"
    },
    {
      id: 48,
      name: "Dr. Mark Johnson",
      province: "NL",
      category: "other",
      subject: "Ocean AI Research",
      message: "AI ocean monitoring helps understand climate change impacts on our coasts. Newfoundland should invest in marine technology research.",
      timeAgo: "7d"
    },
    {
      id: 49,
      name: "Yuki Tanaka",
      province: "BC",
      category: "regulation",
      subject: "AI Startup Support",
      message: "Vancouver's AI startup scene needs balanced regulation - protective enough for consumers, flexible enough for innovation to thrive.",
      timeAgo: "8d"
    },
    {
      id: 50,
      name: "Dr. Elizabeth Cree",
      province: "MB",
      category: "healthcare",
      subject: "Rural Medical AI",
      message: "AI diagnostic support could transform rural healthcare delivery. Manitoba should pilot AI systems connecting remote communities to specialists.",
      timeAgo: "8d"
    },
    {
      id: 51,
      name: "Antoine Moreau",
      province: "QC",
      category: "employment",
      subject: "Creative Industry AI",
      message: "AI tools help Quebec artists and designers, but we must protect creative workers' rights and ensure fair compensation for AI training data.",
      timeAgo: "8d"
    },
    {
      id: 52,
      name: "Dr. Sarah Two Bears",
      province: "AB",
      category: "privacy",
      subject: "Sacred Site Protection",
      message: "AI mapping and monitoring systems must respect sacred Indigenous sites. Technology should protect, not exploit, culturally significant places.",
      timeAgo: "8d"
    },
    {
      id: 53,
      name: "Michael Kowalczyk",
      province: "ON",
      category: "economy",
      subject: "Manufacturing Renaissance",
      message: "AI could bring manufacturing back to Ontario through automation. We need policies supporting both technological advancement and worker transition.",
      timeAgo: "9d"
    },
    {
      id: 54,
      name: "Dr. Fatou Diallo",
      province: "NS",
      category: "education",
      subject: "Multilingual AI Education",
      message: "AI education tools must serve all of Canada's linguistic communities. Nova Scotia's diverse population needs inclusive technology solutions.",
      timeAgo: "9d"
    },
    {
      id: 55,
      name: "James McLeod",
      province: "PE",
      category: "other",
      subject: "Agricultural AI Ethics",
      message: "Precision farming AI raises questions about food sovereignty and farmer autonomy. PEI should ensure technology serves farmers, not controls them.",
      timeAgo: "9d"
    },
    {
      id: 56,
      name: "Dr. Meera Krishnan",
      province: "BC",
      category: "ethics",
      subject: "AI Research Transparency",
      message: "Academic AI research needs public oversight and transparency. Citizens should understand how their data contributes to AI development.",
      timeAgo: "9d"
    },
    {
      id: 57,
      name: "Paul Gagnon",
      province: "NB",
      category: "employment",
      subject: "Green Economy Transition",
      message: "AI can optimize renewable energy systems, creating new jobs while traditional energy roles decline. We need coordinated transition planning.",
      timeAgo: "10d"
    },
    {
      id: 58,
      name: "Dr. Angela Bright Star",
      province: "YT",
      category: "regulation",
      subject: "Northern Governance",
      message: "Arctic AI applications need governance frameworks respecting Indigenous sovereignty and environmental protection in Canada's North.",
      timeAgo: "10d"
    }
  ];

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
        </div>
      </div>
      
      {/* Voices Count Metric */}
      <div className="mt-3 text-center">
        <div className="text-white/90 text-sm">
          <span className="font-semibold text-lg">{mockSubmissions.length.toLocaleString()}</span>
          <span className="ml-1">Canadians have shared their thoughts</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsFeed;
