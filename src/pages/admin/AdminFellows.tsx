import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Fellow {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  is_featured: boolean;
  created_at: string;
}

const AdminFellows = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFellow, setEditingFellow] = useState<Fellow | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fellows, isLoading, error } = useQuery({
    queryKey: ['fellows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fellows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Fellow[];
    },
  });

  const createFellowMutation = useMutation({
    mutationFn: async (newFellow: Omit<Fellow, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('fellows')
        .insert([newFellow]);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      setIsDialogOpen(false);
      setEditingFellow(null);
      toast({
        title: 'Success',
        description: 'Fellow created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateFellowMutation = useMutation({
    mutationFn: async (updatedFellow: Fellow) => {
      const { data, error } = await supabase
        .from('fellows')
        .update(updatedFellow)
        .eq('id', updatedFellow.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      setIsDialogOpen(false);
      setEditingFellow(null);
      toast({
        title: 'Success',
        description: 'Fellow updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteFellowMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('fellows')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      toast({
        title: 'Success',
        description: 'Fellow deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateFellow = async (newFellow: Omit<Fellow, 'id' | 'created_at'>) => {
    createFellowMutation.mutate(newFellow);
  };

  const handleUpdateFellow = async (updatedFellow: Fellow) => {
    updateFellowMutation.mutate(updatedFellow);
  };

  const handleDeleteFellow = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fellow?')) {
      deleteFellowMutation.mutate(id);
    }
  };

  const handleEditFellow = (fellow: Fellow) => {
    setEditingFellow(fellow);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute adminOnly={true}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Fellows Management</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Fellows</CardTitle>
              <CardDescription>Manage featured fellows.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell className="flex justify-end gap-4">
                        <Skeleton className="w-6 h-6" />
                        <Skeleton className="w-6 h-6" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ProtectedAdminRoute>
    );
  }

  if (error) {
    return (
      <ProtectedAdminRoute adminOnly={true}>
        <div className="p-4">
          Error: {error.message}
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Fellows Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Fellow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingFellow ? 'Edit Fellow' : 'Create Fellow'}</DialogTitle>
              </DialogHeader>
              <FellowForm
                fellow={editingFellow}
                onCreate={handleCreateFellow}
                onUpdate={handleUpdateFellow}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingFellow(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Fellows</CardTitle>
            <CardDescription>Manage featured fellows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fellows?.map((fellow) => (
                  <TableRow key={fellow.id}>
                    <TableCell className="font-medium">{fellow.name}</TableCell>
                    <TableCell>{fellow.title}</TableCell>
                    <TableCell className="flex justify-end gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFellow(fellow)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteFellow(fellow.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {fellows && fellows.length === 0 && (
              <div className="text-center p-4">
                No fellows found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

interface FellowFormProps {
  fellow?: Fellow | null;
  onCreate: (newFellow: Omit<Fellow, 'id' | 'created_at'>) => void;
  onUpdate: (updatedFellow: Fellow) => void;
  onClose: () => void;
}

const FellowForm = ({ fellow, onCreate, onUpdate, onClose }: FellowFormProps) => {
  const [name, setName] = useState(fellow?.name || '');
  const [title, setTitle] = useState(fellow?.title || '');
  const [bio, setBio] = useState(fellow?.bio || '');
  const [image_url, setImageUrl] = useState(fellow?.image_url || '');
  const [linkedin_url, setLinkedinUrl] = useState(fellow?.linkedin_url || '');
  const [twitter_url, setTwitterUrl] = useState(fellow?.twitter_url || '');
  const [website_url, setWebsiteUrl] = useState(fellow?.website_url || '');
  const [is_featured, setIsFeatured] = useState(fellow?.is_featured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fellowData = {
      name,
      title,
      bio,
      image_url,
      linkedin_url,
      twitter_url,
      website_url,
      is_featured,
    };

    if (fellow) {
      onUpdate({ ...fellow, ...fellowData });
    } else {
      onCreate(fellowData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input
          type="textarea"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          type="text"
          id="image_url"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <Input
          type="text"
          id="linkedin_url"
          value={linkedin_url}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="twitter_url">Twitter URL</Label>
        <Input
          type="text"
          id="twitter_url"
          value={twitter_url}
          onChange={(e) => setTwitterUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          type="text"
          id="website_url"
          value={website_url}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="is_featured">
          <Input
            type="checkbox"
            id="is_featured"
            checked={is_featured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="mr-2"
          />
          Is Featured
        </Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {fellow ? 'Update Fellow' : 'Create Fellow'}
        </Button>
      </div>
    </form>
  );
};

export default AdminFellows;
