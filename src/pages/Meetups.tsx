
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MeetupFeed from "@/components/MeetupFeed";

const Meetups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tech Meetups</h1>
            <p className="text-gray-600">
              Discover emerging technology meetups from enthusiasts around the world who are exploring the future of innovation.
            </p>
          </div>
          <MeetupFeed />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Meetups;
