import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  EyeOff,
  FileText,
  Filter,
  Calendar,
  User,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useArticleImageUpload } from '@/components/admin/article-form/useArticleImageUpload';
import ArticleImageUpload from '@/components/admin/article-form/ArticleImageUpload';

interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  author_id?: string;
  is_published: boolean;
  is_featured: boolean;
  image_url?: string;
}

const AdminArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm<ArticleFormData>();
  
  const {
    imageFile,
    imagePreview,
    imageMetadata,
    isUploading,
    setIsUploading,
    handleImageChange,
    handleRemoveImage,
    uploadImage
  } = useArticleImageUpload();

  // Fetch contributors for author selection
  const { data: contributors } = useQuery({
    queryKey: ['contributors-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributors')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch articles with enhanced filtering
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['admin-articles', searchTerm, statusFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          contributors(name),
          partnerships(organization_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('is_published', statusFilter === 'published');
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { articles: data || [], total: count || 0 };
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      setIsUploading(true);
      
      let imageUrl = data.image_url;
      let imageWidth, imageHeight, imageFileSize;
      
      // Upload image if there's a new file
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (imageMetadata) {
          imageWidth = imageMetadata.width;
          imageHeight = imageMetadata.height;
          imageFileSize = imageMetadata.fileSize;
        }
      }
      
      const { error } = await supabase
        .from('articles')
        .insert([{
          ...data,
          image_url: imageUrl,
          image_width: imageWidth,
          image_height: imageHeight,
          image_file_size: imageFileSize,
          published_at: data.is_published ? new Date().toISOString() : null
        }]);
      if (error) throw error;
      
      setIsUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setShowForm(false);
      reset();
      handleRemoveImage(setValue);
      toast({ title: 'Article created successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating article', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ArticleFormData }) => {
      setIsUploading(true);
      
      let imageUrl = data.image_url;
      let imageWidth, imageHeight, imageFileSize;
      
      // Upload image if there's a new file
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (imageMetadata) {
          imageWidth = imageMetadata.width;
          imageHeight = imageMetadata.height;
          imageFileSize = imageMetadata.fileSize;
        }
      }
      
      const updateData: any = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };
      
      if (imageUrl) {
        updateData.image_url = imageUrl;
        updateData.image_width = imageWidth;
        updateData.image_height = imageHeight;
        updateData.image_file_size = imageFileSize;
      }
      
      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      
      setIsUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setShowForm(false);
      setEditingArticle(null);
      reset();
      handleRemoveImage(setValue);
      toast({ title: 'Article updated successfully' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({ title: 'Article deleted successfully' });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('articles')
        .update({
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({ title: 'Article status updated' });
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { error } = await supabase
        .from('articles')
        .update({
          is_featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast({ title: 'Article featured status updated' });
    }
  });

  const onSubmit = (data: ArticleFormData) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setValue('title', article.title);
    setValue('slug', article.slug);
    setValue('content', article.content || '');
    setValue('author_id', article.author_id || '');
    setValue('is_published', article.is_published || false);
    setValue('is_featured', article.is_featured || false);
    setValue('image_url', article.image_url || '');
    setShowForm(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const totalPages = Math.ceil((articlesData?.total || 0) / pageSize);

  return (
    <AdminLayout requiredSection="articles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
            <p className="text-gray-600 mt-2">Create and manage articles and content</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingArticle(null);
                reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? 'Edit Article' : 'Create New Article'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      {...register('title', { required: true })}
                      placeholder="Article title"
                      onChange={(e) => {
                        setValue('title', e.target.value);
                        setValue('slug', generateSlug(e.target.value));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      {...register('slug', { required: true })}
                      placeholder="article-slug"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Select onValueChange={(value) => setValue('author_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {contributors?.map((contributor) => (
                        <SelectItem key={contributor.id} value={contributor.id}>
                          {contributor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ArticleImageUpload
                  imagePreview={imagePreview}
                  fieldValue={watch('image_url') || ''}
                  imageMetadata={imageMetadata}
                  onImageChange={(e) => handleImageChange(e, setValue)}
                  onRemoveImage={() => handleRemoveImage(setValue)}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    {...register('content')}
                    placeholder="Write your article content here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('is_published')}
                      id="published"
                      className="rounded"
                    />
                    <label htmlFor="published" className="text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('is_featured')}
                      id="featured"
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Feature this article
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                    {isUploading ? 'Uploading...' : editingArticle ? 'Update' : 'Create'} Article
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold">{articlesData?.total || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {articlesData?.articles.filter(a => a.is_published).length || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {articlesData?.articles.filter(a => !a.is_published).length || 0}
                  </p>
                </div>
                <EyeOff className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Authors</p>
                  <p className="text-2xl font-bold">{contributors?.length || 0}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Articles ({articlesData?.total || 0})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading articles...
                      </TableCell>
                    </TableRow>
                  ) : articlesData?.articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm ? 'No articles found matching your search.' : 'No articles created yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    articlesData?.articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{article.title}</div>
                            <div className="text-sm text-gray-500">/{article.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {article.contributors?.name || 'System'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={article.is_published ? "default" : "secondary"}>
                            {article.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeaturedMutation.mutate({
                              id: article.id,
                              isFeatured: article.is_featured
                            })}
                            className="hover:bg-yellow-50"
                          >
                            {article.is_featured ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            ) : (
                              <Star className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(article.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublishMutation.mutate({
                                id: article.id,
                                isPublished: article.is_published
                              })}
                            >
                              {article.is_published ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(article)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this article?')) {
                                  deleteMutation.mutate(article.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;