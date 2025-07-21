
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import fallbackImage from "@/assets/fallback-article-image.jpg";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    published_at: string | null;
    image_url: string | null;
    contributors?: {
      id: string;
      name: string;
      headshot_url: string | null;
    } | null;
  };
  referrer?: "home" | "articles";
}

const ArticleCard = ({ article, referrer }: ArticleCardProps) => {
  const getExcerpt = (content: string | null) => {
    if (!content) return "";
    const plainText = content.replace(/[#*`\[\]]/g, "");
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const articleUrl = referrer ? `/articles/${article.slug}?from=${referrer}` : `/articles/${article.slug}`;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
          <ResponsiveImage
            src={article.image_url || fallbackImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">Article</Badge>
            {article.published_at && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(article.published_at)}
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            {article.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {getExcerpt(article.content)}
          </p>
          {article.contributors && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <User className="h-4 w-4" />
              <span>{article.contributors.name}</span>
            </div>
          )}
          <div className="mt-auto">
            <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Link to={articleUrl}>
                View Article
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
