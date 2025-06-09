
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CommunityFeed from "@/components/CommunityFeed";

const Feed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommunityFeed />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feed;
