
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, ExternalLink, Download, BarChart3, FileText } from "lucide-react";

const DataCommons = () => {
  const { data: datasets, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getFormatIcon = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'csv':
        return <FileText className="w-4 h-4" />;
      case 'json':
        return <Database className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'csv':
        return 'bg-green-100 text-green-800';
      case 'json':
        return 'bg-blue-100 text-blue-800';
      case 'xlsx':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Data Commons</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Access open datasets, research findings, and data tools to support evidence-based AI policy research. 
              Our data commons promotes transparency and enables collaborative analysis of AI's impact on Canadian society.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">Open Data Initiative</h2>
              </div>
              <p className="text-blue-800 max-w-3xl mx-auto mb-4">
                PolicyNow is committed to open science principles. All datasets are made available under open licenses 
                to enable reproducible research and collaborative policy development.
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Learn About Our Data Standards
              </Button>
            </div>
          </div>

          {/* Datasets Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">Available Datasets</h2>
              </div>
              <Badge variant="outline" className="text-sm">
                {datasets?.length || 0} datasets available
              </Badge>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : datasets && datasets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets.map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{dataset.title}</CardTitle>
                        {dataset.format && (
                          <Badge className={getFormatColor(dataset.format)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getFormatIcon(dataset.format)}
                              {dataset.format.toUpperCase()}
                            </div>
                          </Badge>
                        )}
                      </div>
                      {dataset.source_organization && (
                        <p className="text-sm text-gray-600">
                          Source: {dataset.source_organization}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {dataset.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {dataset.description}
                        </p>
                      )}
                      
                      {dataset.category && (
                        <Badge variant="outline" className="mb-4">
                          {dataset.category}
                        </Badge>
                      )}
                      
                      <div className="flex gap-2">
                        {dataset.file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={dataset.file_url} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                        {dataset.external_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={dataset.external_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Source
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        Added {new Date(dataset.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Datasets Available</h3>
                  <p className="text-gray-600 mb-6">
                    We're working on curating valuable datasets for AI policy research. Check back soon!
                  </p>
                  <Button variant="outline">
                    Suggest a Dataset
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Data Visualization Tools Section */}
          <section className="mt-16">
            <div className="bg-white rounded-lg border p-8">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Visualization Tools</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Interactive tools to explore and visualize policy data are coming soon. 
                  These will enable researchers and policymakers to gain insights from our open datasets.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" disabled>
                    Chart Builder (Coming Soon)
                  </Button>
                  <Button variant="outline" disabled>
                    Data Explorer (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DataCommons;
