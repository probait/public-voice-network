
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

const JobDisplacement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop" 
                alt="Job displacement and automation" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  Published on June 11, 2025 • 8 min read
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Job Displacement & Automation: Preparing Canada's Workforce for an AI Future
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  As artificial intelligence continues to advance at an unprecedented pace, Canadian workers across all sectors are grappling with a fundamental question: What does the future of work look like in an AI-driven economy?
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Current Landscape</h2>
                <p>
                  Recent studies suggest that up to 40% of Canadian jobs could be significantly impacted by AI automation within the next two decades. From manufacturing floors in Ontario to financial services in Toronto, AI is reshaping how work gets done across the country.
                </p>
                
                <p>
                  However, the story isn't simply one of job losses. History shows us that technological revolutions often create new opportunities even as they eliminate old ones. The key challenge for Canada is ensuring our workforce is prepared for this transition.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industries at the Forefront</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Manufacturing</h3>
                <p>
                  Canadian manufacturing has already seen significant automation, but AI represents the next wave. Smart factories powered by AI can optimize production in real-time, predict equipment failures, and maintain quality control with minimal human intervention.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Financial Services</h3>
                <p>
                  From algorithmic trading to AI-powered customer service, Canada's financial sector is rapidly adopting AI technologies. While this improves efficiency and reduces costs, it also means traditional roles in banking and insurance are evolving rapidly.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Healthcare</h3>
                <p>
                  AI is revolutionizing diagnostics and treatment planning across Canadian hospitals. While this enhances patient care, it also changes the skill requirements for healthcare professionals.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Skills Gap Challenge</h2>
                <p>
                  As AI transforms job requirements, Canada faces a growing skills gap. Workers need to develop new competencies to remain relevant in an AI-augmented workplace. This includes not just technical skills, but also uniquely human capabilities like creativity, emotional intelligence, and complex problem-solving.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Policy Responses and Solutions</h2>
                <p>
                  The Canadian government has begun addressing these challenges through various initiatives:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Investment in digital skills training programs</li>
                  <li>Support for lifelong learning initiatives</li>
                  <li>Partnerships between educational institutions and industry</li>
                  <li>Research into Universal Basic Income pilots</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regional Impacts</h2>
                <p>
                  The impact of AI on employment won't be uniform across Canada. Urban centers like Toronto, Montreal, and Vancouver may see more new AI-related job creation, while rural and resource-dependent communities could face greater challenges in adapting to change.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Canadians Are Saying</h2>
                <p>
                  Through our community engagement platform, we're hearing diverse perspectives from Canadians about AI's impact on their work:
                </p>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "I work in customer service, and I see AI chatbots handling more inquiries every day. I'm worried about my job, but I'm also taking online courses to learn new skills." - Sarah, Calgary
                </blockquote>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "As a small business owner, AI tools help me compete with bigger companies. But I worry about the broader impact on employment in our community." - Mike, Halifax
                </blockquote>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Moving Forward</h2>
                <p>
                  Canada's response to AI-driven job displacement will require collaboration between government, industry, educational institutions, and workers themselves. We need policies that support workforce transition while fostering innovation and economic growth.
                </p>
                
                <p>
                  The conversation about AI's impact on work is just beginning. By bringing together diverse voices from across Canada, we can develop solutions that work for everyone.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Share Your Experience</h3>
                  <p className="text-red-700 mb-4">
                    How is AI affecting your work or community? Your voice matters in shaping Canada's response to these challenges.
                  </p>
                  <Link to="/get-involved">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Get Involved
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDisplacement;
