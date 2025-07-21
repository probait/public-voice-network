
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useArticle } from "@/hooks/useArticles";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Share2, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ArticleContent from "@/components/ArticleContent";
import fallbackImage from "@/assets/fallback-article-image.jpg";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const { data: article, isLoading, error } = useArticle(slug || "");

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Article link has been copied to clipboard.",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBackButtonText = () => {
    return from === 'home' ? 'Back to Homepage' : 'Back to Articles';
  };

  const getBackButtonDestination = () => {
    return from === 'home' ? '/' : '/articles';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-muted rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Button variant="ghost" asChild className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900 w-fit">
              <Link to={getBackButtonDestination()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {getBackButtonText()}
              </Link>
            </Button>
            
            {from === 'home' && (
              <Button variant="outline" asChild className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-fit">
                <Link to="/articles">
                  <List className="h-4 w-4 mr-2" />
                  Show all articles
                </Link>
              </Button>
            )}
          </nav>

          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8">
            <img
              src={article.image_url || fallbackImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Article</Badge>
              {article.published_at && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-6 text-foreground">
            {article.title}
          </h1>

          {article.contributors && (
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    {article.contributors.name}
                  </p>
                  {article.contributors.organization && (
                    <p className="text-sm text-muted-foreground">
                      {article.contributors.organization}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <ArticleContent content={article.content || ""} />

          <div className="mt-12 pt-8 border-t border-border">
            <Button asChild>
              <Link to="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Article;
