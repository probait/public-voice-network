
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Submission {
  id: number;
  concern: string;
  name: string;
  location: string;
  timestamp: string;
  isAnonymous: boolean;
}

const CommunityFeed = ({ limit }: { limit?: number }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
    setSubmissions(stored);
  }, []);

  const regions = Array.from(new Set(submissions.map(s => s.location))).filter(Boolean);
  
  const filteredSubmissions = submissions.filter(submission => 
    selectedRegion === "all" || submission.location === selectedRegion
  );

  const displayedSubmissions = limit ? filteredSubmissions.slice(0, limit) : filteredSubmissions;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayName = (submission: Submission) => {
    if (submission.isAnonymous) return "Anonymous";
    const firstName = submission.name.split(' ')[0];
    const location = submission.location.split(',')[0];
    return `${firstName}, ${location}`;
  };

  return (
    <div className="space-y-6">
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-2xl font-bold">Community Feed</h2>
          <div className="w-full sm:w-auto">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {displayedSubmissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No submissions yet. Be the first to share your voice!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-muted-foreground">
                    {submission.location} • {getDisplayName(submission)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(submission.timestamp)}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{submission.concern}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
