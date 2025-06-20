
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

const contributorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  bio: z.string().optional(),
  organization: z.string().optional(),
  institution: z.string().optional(),
  twitter_url: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website_url: z.string().url('Invalid website URL').optional().or(z.literal('')),
  is_featured: z.boolean().optional(),
});

type ContributorFormData = z.infer<typeof contributorSchema>;

interface ContributorFormProps {
  contributor?: any;
  onClose: () => void;
}

const ContributorForm = ({ contributor, onClose }: ContributorFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [headshotUrl, setHeadshotUrl] = useState(contributor?.headshot_url || '');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContributorFormData>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
      name: contributor?.name || '',
      email: contributor?.email || '',
      bio: contributor?.bio || '',
      organization: contributor?.organization || '',
      institution: contributor?.institution || '',
      twitter_url: contributor?.twitter_url || '',
      linkedin_url: contributor?.linkedin_url || '',
      website_url: contributor?.website_url || '',
      is_featured: contributor?.is_featured || false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContributorFormData) => {
      const contributorData = {
        name: data.name,
        email: data.email || null,
        bio: data.bio || null,
        organization: data.organization || null,
        institution: data.institution || null,
        twitter_url: data.twitter_url || null,
        linkedin_url: data.linkedin_url || null,
        website_url: data.website_url || null,
        is_featured: data.is_featured || false,
        headshot_url: headshotUrl || null,
        featured_until: data.is_featured ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      };

      if (contributor) {
        const { error } = await supabase
          .from('contributors')
          .update(contributorData)
          .eq('id', contributor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contributors')
          .insert(contributorData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      toast({ 
        title: contributor ? 'Contributor updated' : 'Contributor created',
        description: 'The contributor has been saved successfully.'
      });
      onClose();
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const uploadHeadshot = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `headshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setHeadshotUrl(data.publicUrl);
      toast({ title: 'Headshot uploaded successfully' });
    } catch (error) {
      toast({ 
        title: 'Upload failed', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ContributorFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Headshot Upload */}
        <div className="space-y-2">
          <Label>Profile Photo</Label>
          <div className="flex items-center gap-4">
            {headshotUrl && (
              <div className="relative">
                <img
                  src={headshotUrl}
                  alt="Headshot preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={() => setHeadshotUrl('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadHeadshot(file);
                }}
                disabled={uploading}
                className="hidden"
                id="headshot-upload"
              />
              <Label
                htmlFor="headshot-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Featured Contributor</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : (contributor ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContributorForm;
