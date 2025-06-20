
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventbriteFeed from "@/components/EventbriteFeed";

const Events = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Events Across Canada</h1>
            <p className="text-gray-600">
              Discover conferences, workshops, and discussions about artificial intelligence happening across the country. 
              These carefully selected events offer opportunities to learn, network, and engage with Canada's AI community.
            </p>
          </div>

          {/* All Events Section - now unified */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <EventbriteFeed />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
