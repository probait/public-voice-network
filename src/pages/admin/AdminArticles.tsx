import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
// import AdminArticleForm from '@/components/admin/AdminArticleForm';

interface Article {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  contributors: {
    name: string;
  };
}

const AdminArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          contributors:author_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async ({ articleId, published }: { articleId: string; published: boolean }) => {
      const { error } = await supabase
        .from('articles')
        .update({ is_published: published })
        .eq('id', articleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({
        title: 'Success',
        description: 'Article status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update article status',
        variant: 'destructive',
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (articleIds: string[]) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', articleIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setSelectedArticles(new Set());
      toast({
        title: 'Success',
        description: 'Articles deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete articles',
        variant: 'destructive',
      });
    },
  });

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.contributors?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectArticle = (articleId: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.add(articleId);
    }
    setSelectedArticles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map(article => article.id)));
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDelete = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(articleId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedArticles.size} articles?`)) {
      bulkDeleteMutation.mutate([...selectedArticles]);
    }
  };

  const handleTogglePublished = (articleId: string, published: boolean) => {
    togglePublishedMutation.mutate({ articleId, published });
  };

  const publishedCount = articles.filter(a => a.is_published).length;
  const draftCount = articles.filter(a => !a.is_published).length;

  if (isLoading) {
    return (
      <ProtectedAdminRoute requiredSection="articles">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute requiredSection="articles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingArticle(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? 'Edit Article' : 'Create New Article'}
                </DialogTitle>
              </DialogHeader>
              <div className="text-center p-8 text-gray-500">
                Article form coming soon...
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <EyeOff className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Articles</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedArticles.size > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedArticles.size} article(s) selected
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedArticles(new Set())}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedArticles.has(article.id)}
                          onChange={() => handleSelectArticle(article.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{article.title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {article.content?.substring(0, 100)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {article.contributors?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={article.is_published ? "default" : "secondary"}
                          className={article.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {article.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(article.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(article.updated_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublished(article.id, !article.is_published)}
                            disabled={togglePublishedMutation.isPending}
                          >
                            {article.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(article)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No articles found matching your search.' : 'No articles created yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminArticles;
