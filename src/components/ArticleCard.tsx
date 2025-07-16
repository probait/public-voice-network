import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
}

const ArticleCard = ({ article }: ArticleCardProps) => {
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

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <Link to={`/articles/${article.slug}`}>
          <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
            <ResponsiveImage
              src={article.image_url || fallbackImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">Article</Badge>
              {article.published_at && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {getExcerpt(article.content)}
            </p>
            {article.contributors && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{article.contributors.name}</span>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;