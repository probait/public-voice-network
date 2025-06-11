
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

const HealthcareInnovation = () => {
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
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop" 
                alt="Healthcare innovation and AI" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  Published on June 11, 2025 • 12 min read
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Healthcare Innovation: AI's Promise and Challenges for Canadian Medicine
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Artificial intelligence is revolutionizing healthcare across Canada, from diagnostic imaging in major urban hospitals to telemedicine services reaching remote communities. But with great promise comes significant challenges around equity, access, and the future of medical practice.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Current State of AI in Canadian Healthcare</h2>
                <p>
                  Canada's healthcare system is increasingly embracing AI technologies. Major hospitals in Toronto, Montreal, and Vancouver are using AI for medical imaging analysis, while innovative startups across the country are developing AI solutions for drug discovery, patient monitoring, and clinical decision support.
                </p>
                
                <p>
                  The COVID-19 pandemic accelerated many of these adoptions, as healthcare systems sought ways to improve efficiency and reduce strain on overworked medical professionals.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Breakthrough Applications</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Diagnostic Imaging</h3>
                <p>
                  AI-powered radiology tools are now helping Canadian doctors detect cancer, heart disease, and other conditions earlier and more accurately. The University of Toronto's research into AI-assisted mammography screening has shown promising results in improving breast cancer detection rates.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Drug Discovery</h3>
                <p>
                  Canadian biotech companies are using AI to accelerate drug development, potentially reducing the time and cost of bringing new treatments to market. This is particularly important for rare diseases that affect small patient populations.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Telemedicine and Remote Care</h3>
                <p>
                  AI-enhanced telemedicine platforms are crucial for serving Canada's vast rural and northern communities. These systems can provide preliminary assessments and triage patients, ensuring that those who need urgent care receive it promptly.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Predictive Analytics</h3>
                <p>
                  Hospitals across Canada are using AI to predict patient deterioration, optimize bed management, and prevent hospital-acquired infections. These systems help healthcare providers allocate resources more effectively.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Equity Challenge</h2>
                <p>
                  While AI promises to improve healthcare outcomes, there's a real risk that it could exacerbate existing inequalities in the Canadian healthcare system. Advanced AI tools are typically deployed first in well-funded urban hospitals, potentially widening the gap between care available in cities versus rural areas.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Geographic Disparities</h3>
                <p>
                  Remote and Indigenous communities often have limited access to high-speed internet and specialized medical equipment needed for AI-enhanced healthcare. Ensuring equitable access to AI benefits requires significant infrastructure investment.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Bias in AI Systems</h3>
                <p>
                  AI systems trained on data that doesn't represent Canada's diverse population may perform poorly for certain groups. This is particularly concerning for Indigenous Canadians, who have historically been underrepresented in medical research.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Provincial Initiatives</h2>
                <p>
                  Each province is taking its own approach to healthcare AI:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Ontario</strong> - The Vector Institute and OAHPP are leading AI research initiatives</li>
                  <li><strong>Quebec</strong> - Mila and CHU Sainte-Justine are pioneering pediatric AI applications</li>
                  <li><strong>British Columbia</strong> - AI for Good initiative focuses on practical healthcare applications</li>
                  <li><strong>Alberta</strong> - Amii is developing AI solutions for rural healthcare delivery</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regulatory and Safety Considerations</h2>
                <p>
                  Health Canada is developing new frameworks for regulating AI medical devices and software. The challenge is creating rules that ensure safety and efficacy without stifling innovation. Key considerations include:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clinical validation requirements for AI diagnostic tools</li>
                  <li>Data governance and patient privacy protection</li>
                  <li>Liability questions when AI systems make errors</li>
                  <li>Professional licensing for AI-assisted medical practice</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Human Element</h2>
                <p>
                  While AI can enhance medical practice, Canadian healthcare providers emphasize that technology must supplement, not replace, human judgment and compassion. The doctor-patient relationship remains central to effective healthcare delivery.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Patient Perspectives</h2>
                <p>
                  Canadians have mixed feelings about AI in healthcare. Our community platform reveals diverse viewpoints:
                </p>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "AI helped doctors catch my father's lung cancer early. I'm grateful for the technology, but I still want a human doctor making the final decisions." - Maria, Toronto
                </blockquote>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "Living in a small town, AI-powered telemedicine gives us access to specialists we never had before. But we need better internet infrastructure to make it work properly." - Robert, Timmins
                </blockquote>
                
                <blockquote className="border-l-4 border-red-600 pl-4 italic text-gray-700 my-6">
                  "As an Indigenous person, I worry that AI systems won't understand our unique health challenges and cultural needs." - Sarah, Nunavut
                </blockquote>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Economic Impact</h2>
                <p>
                  Healthcare AI could generate significant economic benefits for Canada through improved efficiency and reduced costs. However, implementation requires substantial upfront investment in technology, training, and infrastructure.
                </p>
                
                <p>
                  The sector also presents opportunities for Canadian companies to export healthcare AI solutions globally, potentially making Canada a leader in health technology innovation.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Training and Workforce Development</h2>
                <p>
                  Successfully integrating AI into Canadian healthcare requires training current medical professionals and adapting medical education programs. This includes:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI literacy training for doctors and nurses</li>
                  <li>New roles like clinical AI specialists</li>
                  <li>Interdisciplinary collaboration between medicine and technology</li>
                  <li>Ongoing professional development as AI tools evolve</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Looking Ahead</h2>
                <p>
                  The future of AI in Canadian healthcare depends on addressing current challenges while building on existing strengths. Key priorities include:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ensuring equitable access across all communities</li>
                  <li>Developing robust data governance frameworks</li>
                  <li>Fostering collaboration between provinces</li>
                  <li>Maintaining focus on patient-centered care</li>
                </ul>
                
                <p>
                  Success will require ongoing dialogue between healthcare providers, patients, technologists, and policymakers. Canada has the opportunity to demonstrate how AI can enhance healthcare while preserving the values of equity and compassion that define our healthcare system.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Share Your Healthcare AI Experience</h3>
                  <p className="text-red-700 mb-4">
                    Have you encountered AI in your healthcare journey? Share your experiences to help shape the future of medical AI in Canada.
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

export default HealthcareInnovation;
