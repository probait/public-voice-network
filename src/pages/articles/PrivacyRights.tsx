
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

const PrivacyRights = () => {
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
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop" 
                alt="Privacy and digital rights" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  Published on June 11, 2025 • 10 min read
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Privacy & Digital Rights: Protecting Canadians in the Age of AI
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  As AI systems become more sophisticated and pervasive, they're collecting, analyzing, and making decisions based on unprecedented amounts of personal data. How do we balance innovation with fundamental privacy rights?
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Privacy Paradox</h2>
                <p>
                  Modern AI systems require vast amounts of data to function effectively. From facial recognition systems in public spaces to personalized healthcare algorithms, AI promises tremendous benefits. However, these same systems can also enable surveillance and control on a scale never before possible.
                </p>
                
                <p>
                  Canada finds itself at a crossroads: How do we harness AI's potential while preserving the privacy rights that are fundamental to our democratic society?
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Current Legal Framework</h2>
                <p>
                  Canada's privacy landscape is governed by several key pieces of legislation:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> - Governs how private sector organizations collect and use personal information</li>
                  <li><strong>Privacy Act</strong> - Regulates federal government handling of personal information</li>
                  <li><strong>Provincial privacy laws</strong> - Including Quebec's Bill 64 and BC's Personal Information Protection Act</li>
                </ul>
                
                <p>
                  However, these laws were largely written before the AI revolution and may not adequately address modern challenges.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">AI-Specific Privacy Challenges</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Algorithmic Decision-Making</h3>
                <p>
                  When AI systems make decisions about hiring, lending, or law enforcement, the process is often opaque. Canadians have a right to understand how decisions affecting them are made, but AI's "black box" nature makes this challenging.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Facial Recognition Technology</h3>
                <p>
                  Several Canadian cities and organizations have deployed facial recognition systems for security purposes. While proponents argue these enhance safety, critics worry about creating a surveillance state where anonymity becomes impossible.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Inference and Profiling</h3>
                <p>
                  AI can infer sensitive information about individuals from seemingly innocuous data. For example, shopping patterns might reveal health conditions, or social media activity could predict political beliefs. How do we protect against unwanted inferences?
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Approaches</h2>
                <p>
                  Canada is not alone in grappling with these issues. The European Union's GDPR includes provisions for automated decision-making, while California's CCPA gives consumers rights over their personal information. Canada's proposed Bill C-27 aims to modernize our privacy laws for the digital age.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sector-Specific Concerns</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Healthcare</h3>
                <p>
                  AI in healthcare promises personalized treatments and early disease detection. However, health data is among the most sensitive information we have. How do we ensure medical AI benefits patients while protecting their privacy?
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Education</h3>
                <p>
                  Educational AI systems track student performance and adapt learning experiences. While this can improve outcomes, it also creates detailed profiles of young people's abilities and behaviors.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Financial Services</h3>
                <p>
                  AI-powered credit scoring and fraud detection can make financial services more accessible and secure. However, these systems also make decisions that can significantly impact people's lives.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Voices from the Community</h2>
                <p>
                  Canadians across the country are sharing their concerns about AI and privacy:
                </p>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "I worry about my kids growing up in a world where everything they do online is tracked and analyzed. What kind of future are we creating?" - Jennifer, Winnipeg
                </blockquote>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "As someone with a chronic illness, I want AI to help improve my care. But I also need to know my health data is protected." - David, Montreal
                </blockquote>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Proposed Solutions</h2>
                <p>
                  Protecting privacy in the age of AI will require a multi-faceted approach:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Privacy by Design</strong> - Building privacy protections into AI systems from the ground up</li>
                  <li><strong>Algorithmic Transparency</strong> - Requiring explanations for automated decisions</li>
                  <li><strong>Data Minimization</strong> - Collecting only the data necessary for specific purposes</li>
                  <li><strong>Individual Rights</strong> - Giving people control over their data and AI decisions about them</li>
                  <li><strong>Sector-Specific Regulations</strong> - Tailored rules for high-risk AI applications</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Path Forward</h2>
                <p>
                  Canada has an opportunity to be a global leader in responsible AI governance. By bringing together technologists, policymakers, civil society, and citizens, we can develop frameworks that protect privacy while allowing beneficial AI innovation to flourish.
                </p>
                
                <p>
                  The choices we make today about AI and privacy will shape Canada's digital future. It's crucial that all Canadians have a voice in these decisions.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Protect Your Privacy Rights</h3>
                  <p className="text-red-700 mb-4">
                    Share your thoughts on how Canada should balance AI innovation with privacy protection. Your input helps shape policy decisions.
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

export default PrivacyRights;
