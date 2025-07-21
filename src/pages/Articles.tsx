
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Card, CardContent } from '@/components/ui/card';

const Articles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['public-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          contributors(id, name, headshot_url)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Articles & Insights
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Explore in-depth analysis, expert perspectives, and thought-provoking content about AI's impact on Canada
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full animate-pulse bg-white border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} referrer="articles" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No Articles Yet
              </h3>
              <p className="text-gray-600">
                Check back soon for insightful articles about AI's impact on Canada.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Articles;
