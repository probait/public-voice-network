import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Download, Star, StarOff, Search, MessageSquare, Users, Edit2, Trash2, Eye, EyeOff, Filter, Upload } from 'lucide-react';
import BulkActions from '@/components/admin/BulkActions';
import Papa from 'papaparse';

interface ThoughtsSubmission {
  id: string;
  name: string;
  email: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminThoughtsManagement = () => {
  const [submissions, setSubmissions] = useState<ThoughtsSubmission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<ThoughtsSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;
const [importing, setImporting] = useState(false);
const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      // Calculate offset for pagination
      const offset = (currentPage - 1) * pageSize;
      
      let query = supabase
        .from('thoughts_submissions')
        .select('*', { count: 'exact' })
        .range(offset, offset + pageSize - 1);

      // Apply search filter if there's a search term
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,province.ilike.%${searchTerm}%`);
      }

      // Apply featured filter
      if (featuredFilter !== 'all') {
        query = query.eq('featured', featuredFilter === 'featured');
      }

      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      // Apply province filter
      if (provinceFilter !== 'all') {
        query = query.eq('province', provinceFilter);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data, error, count } = await query;

      if (error) throw error;
      setSubmissions(data || []);
      setTotalSubmissions(count || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch thoughts submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, featured: !currentFeatured } : sub
        )
      );

      toast({
        title: currentFeatured ? "Unfeatured" : "Featured",
        description: `Thought ${currentFeatured ? 'removed from' : 'added to'} homepage`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

const importVoicesFromDataset = async () => {
  setImporting(true);
  try {
    const res = await fetch('/data/voices.csv');
    if (!res.ok) throw new Error('Failed to fetch dataset');
    const csvText = await res.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows: any[] = parsed.data as any[];

    const cleanText = (txt: string) => String(txt)
      .replace(/📲/g, '')
      .replace(/[“”]/g, '"')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const chooseText = (row: any) => {
      const candidates = [
        row['Q13_AI_impact_worries_text_OE'],
        row['Q8_AI_helping_BC_community_text_OE'],
        row['Q17_Advice_BC_Leaders_text_OE'],
        row['Q16_Indigenous_communities_involvement_AI_text_OE'],
        row['Q8_AI_helping_BC_community_video_OE_transcription'],
        row['Q13_AI_impact_worries_videos_OE_transcription'],
      ];
      for (const t of candidates) {
        if (t && typeof t === 'string') {
          const cleaned = cleanText(t);
          if (cleaned.length >= 20 && !/i'll type my answer/i.test(cleaned)) return cleaned;
        }
      }
      return '';
    };

    const subjectFrom = (txt: string) => {
      const firstSentence = txt.split(/(?<=[.!?])\s+/)[0] || txt;
      const short = firstSentence.trim().slice(0, 80);
      if (short.length >= 80) return short.replace(/[.,;:!?]$/, '') + '…';
      return short;
    };

    const detectCategory = (txt: string) => {
      const t = txt.toLowerCase();
      if (/(job|employment|work|layoff|career)/.test(t)) return 'employment';
      if (/(health|doctor|hospital|care)/.test(t)) return 'healthcare';
      if (/(school|education|student|teacher|university)/.test(t)) return 'education';
      if (/(privacy|data|surveillance|rights)/.test(t)) return 'privacy';
      if (/(ethic|bias|fair|safety)/.test(t)) return 'ethics';
      if (/(econom|cost|price|afford|salary|wage)/.test(t)) return 'economy';
      if (/(regulat|government|policy|law|rule)/.test(t)) return 'regulation';
      if (/(environment|climate|emission|pollution)/.test(t)) return 'environment';
      if (/(transport|traffic)/.test(t)) return 'transportation';
      return 'other';
    };

    const toName = (loc: string) => {
      if (!loc) return 'BC Resident';
      const city = String(loc).split('/')?.[0]?.trim();
      return city ? `Resident, ${city}` : 'BC Resident';
    };

    const inserts = rows.map((row, idx) => {
      const msg = chooseText(row);
      if (!msg) return null;
      const subject = subjectFrom(msg);
      return {
        name: toName(row['Q1_Location_in_BC']),
        email: `voice-${row['participant_id'] || row['engagement_id'] || idx}@example.com`,
        province: 'BC',
        category: detectCategory(msg),
        subject,
        message: msg,
        featured: true,
      } as const;
    }).filter(Boolean) as any[];

    if (inserts.length === 0) {
      toast({
        title: 'No importable voices',
        description: 'The dataset did not contain usable responses.',
      });
      return;
    }

    const chunkSize = 100;
    for (let i = 0; i < inserts.length; i += chunkSize) {
      const chunk = inserts.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('thoughts_submissions')
        .insert(chunk);
      if (error) throw error;
    }

    toast({
      title: 'Import complete',
      description: `Imported ${inserts.length} voices and featured them.`,
    });

    await fetchSubmissions();
  } catch (err) {
    console.error('Import error:', err);
    toast({
      title: 'Import failed',
      description: 'There was an error importing voices.',
      variant: 'destructive',
    });
  } finally {
    setImporting(false);
  }
};

const exportToCSV = async () => {
    try {
      // Fetch ALL submissions for export (not just current page)
      let query = supabase
        .from('thoughts_submissions')
        .select('*');

      // Apply the same filters that are currently active
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,province.ilike.%${searchTerm}%`);
      }

      if (featuredFilter !== 'all') {
        query = query.eq('featured', featuredFilter === 'featured');
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (provinceFilter !== 'all') {
        query = query.eq('province', provinceFilter);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data: allSubmissions, error } = await query;

      if (error) throw error;

      const headers = [
        'Name',
        'Email', 
        'Province',
        'Category',
        'Subject',
        'Message',
        'Featured',
        'Submitted Date'
      ];

      const csvData = (allSubmissions || []).map(submission => [
        submission.name,
        submission.email,
        submission.province,
        submission.category,
        submission.subject,
        submission.message.replace(/"/g, '""'), // Escape quotes
        submission.featured ? 'Yes' : 'No',
        new Date(submission.created_at).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thoughts-submissions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export complete",
        description: `CSV file with ${csvData.length} thoughts has been downloaded`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the CSV file",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, searchTerm, featuredFilter, categoryFilter, provinceFilter, orderBy, orderDirection]);

  // Reset to first page when filters change
  useEffect(() => {
    if (searchTerm || featuredFilter !== 'all' || categoryFilter !== 'all' || provinceFilter !== 'all') {
      setCurrentPage(1);
    }
  }, [searchTerm, featuredFilter, categoryFilter, provinceFilter]);

  // Get unique categories and provinces for filter options
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allProvinces, setAllProvinces] = useState<string[]>([]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: categories } = await supabase
          .from('thoughts_submissions')
          .select('category')
          .order('category');
        
        const { data: provinces } = await supabase
          .from('thoughts_submissions')
          .select('province')
          .order('province');

        if (categories) {
          setAllCategories([...new Set(categories.map(c => c.category))]);
        }
        if (provinces) {
          setAllProvinces([...new Set(provinces.map(p => p.province))]);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Filter submissions based on search term (now handled in the query)
  const filteredSubmissions = submissions;

  // Calculate total pages
  const totalPages = Math.ceil(totalSubmissions / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleSelectSubmission = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions([...selectedSubmissions, id]);
    } else {
      setSelectedSubmissions(selectedSubmissions.filter(sId => sId !== id));
    }
  };

  const handleEdit = (submission: ThoughtsSubmission) => {
    setViewingSubmission(submission);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const { error } = await supabase
          .from('thoughts_submissions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchSubmissions();
        toast({
          title: 'Success',
          description: 'Submission deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting submission:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete submission',
          variant: 'destructive',
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) {
      try {
        const { error } = await supabase
          .from('thoughts_submissions')
          .delete()
          .in('id', selectedSubmissions);

        if (error) throw error;

        await fetchSubmissions();
        setSelectedSubmissions([]);
        toast({
          title: 'Success',
          description: `${selectedSubmissions.length} submissions deleted successfully`,
        });
      } catch (error) {
        console.error('Error deleting submissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete submissions',
          variant: 'destructive',
        });
      }
    }
  };


  if (loading) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Thoughts Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thoughts Management</h1>
            <p className="text-gray-600 mt-2">Manage citizen submissions and feature them on the homepage</p>
          </div>
<div className="flex items-center gap-2">
  <Button onClick={importVoicesFromDataset} disabled={importing} className="flex items-center gap-2">
    <Upload className="h-4 w-4" />
    {importing ? 'Importing…' : 'Import Voices'}
  </Button>
  <Button onClick={exportToCSV} className="flex items-center gap-2">
    <Download className="h-4 w-4" />
    Export CSV
  </Button>
</div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  All Submissions ({totalSubmissions})
                </CardTitle>
              </div>
              
              {/* Search Row */}
              <div className="w-full">
                <div className="relative max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                  <SelectTrigger className="w-36">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {allProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={`${orderBy}-${orderDirection}`} onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setOrderBy(field);
                  setOrderDirection(direction as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="subject-asc">Subject A-Z</SelectItem>
                    <SelectItem value="subject-desc">Subject Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedSubmissions.length > 0 && (
              <BulkActions
                selectedCount={selectedSubmissions.length}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedSubmissions([])}
              />
            )}

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No submissions found matching your search.' : 'No thoughts submitted yet.'}
                </p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedSubmissions.length === filteredSubmissions.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                       <TableHead className="min-w-[200px]">Citizen</TableHead>
                       <TableHead className="min-w-[200px]">Subject</TableHead>
                       <TableHead className="min-w-[120px]">Category</TableHead>
                       <TableHead className="min-w-[120px]">Province</TableHead>
                       <TableHead className="min-w-[100px]">Date</TableHead>
                       <TableHead className="min-w-[80px]">Featured</TableHead>
                       <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSubmissions.includes(submission.id)}
                            onCheckedChange={(checked) => 
                              handleSelectSubmission(submission.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{submission.name}</div>
                              <div className="text-sm text-gray-500 truncate">{submission.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{submission.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{submission.message}</div>
                          </div>
                        </TableCell>
                         <TableCell>
                           <Badge variant="outline">{submission.category}</Badge>
                         </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{submission.province}</Badge>
                          </TableCell>
                         <TableCell>
                           {new Date(submission.created_at).toLocaleDateString()}
                         </TableCell>
                         <TableCell>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => toggleFeatured(submission.id, submission.featured)}
                             className="hover:bg-yellow-50"
                           >
                              {submission.featured ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <Star className="h-4 w-4 text-gray-400" />
                              )}
                           </Button>
                         </TableCell>
                         <TableCell>
                           <div className="flex items-center space-x-2">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleEdit(submission)}
                             >
                               <Edit2 className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleDelete(submission.id)}
                               className="text-red-600 hover:text-red-700"
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
            </div>
            )}

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

        {/* Detail Dialog */}
        <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thought Submission Details</DialogTitle>
            </DialogHeader>
            {viewingSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Province</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.province}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.category}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <div className="p-3 bg-gray-50 rounded-md font-medium">{viewingSubmission.subject}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {viewingSubmission.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Badge variant={viewingSubmission.featured ? "default" : "secondary"}>
                      {viewingSubmission.featured ? 'Featured' : 'Not Featured'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Submitted on {new Date(viewingSubmission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleFeatured(viewingSubmission.id, viewingSubmission.featured)}
                    >
                      {viewingSubmission.featured ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Feature
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(viewingSubmission.id);
                        setViewingSubmission(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminThoughtsManagement;