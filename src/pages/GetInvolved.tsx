
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThoughtsSubmissionForm from "@/components/ThoughtsSubmissionForm";

const GetInvolved = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Share Your Voice</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your thoughts and concerns about AI's impact on Canada matter. Whether you're worried about job displacement, 
              excited about healthcare innovations, or have questions about privacy rights, we want to hear from you.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Your Thoughts</h2>
            <ThoughtsSubmissionForm />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Why Your Input Matters</h3>
            <p className="text-red-700">
              As AI technology rapidly evolves, policy makers need to hear from real Canadians about how these changes 
              are affecting their lives, work, and communities. Your submissions help inform public discourse and 
              policy decisions that will shape Canada's AI future.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetInvolved;
