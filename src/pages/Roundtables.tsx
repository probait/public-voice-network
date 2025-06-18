
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Users, 
  Video, 
  Clock, 
  ExternalLink,
  UserPlus,
  CheckCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Roundtables = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoundtable, setSelectedRoundtable] = useState<any>(null);
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    organization: ''
  });

  const { data: upcomingRoundtables, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcoming-roundtables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roundtables')
        .select('*')
        .eq('is_upcoming', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: pastRoundtables, isLoading: loadingPast } = useQuery({
    queryKey: ['past-roundtables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roundtables')
        .select('*')
        .or('is_upcoming.eq.false,event_date.lt.' + new Date().toISOString())
        .order('event_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userRsvps } = useQuery({
    queryKey: ['user-rsvps', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('roundtable_rsvps')
        .select('roundtable_id, status')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const rsvpMutation = useMutation({
    mutationFn: async ({ roundtableId, formData }: { roundtableId: string, formData: any }) => {
      const { data, error } = await supabase
        .from('roundtable_rsvps')
        .insert({
          roundtable_id: roundtableId,
          user_id: user?.id,
          name: formData.name,
          email: formData.email,
          organization: formData.organization
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "RSVP Submitted",
        description: "Thank you for your interest! We'll send you event details soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
      setSelectedRoundtable(null);
      setRsvpForm({ name: '', email: '', organization: '' });
    },
    onError: (error: any) => {
      toast({
        title: "RSVP Failed",
        description: error.message || "There was an error submitting your RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const hasUserRsvped = (roundtableId: string) => {
    return userRsvps?.some(rsvp => rsvp.roundtable_id === roundtableId);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoundtable || !user) return;

    rsvpMutation.mutate({
      roundtableId: selectedRoundtable.id,
      formData: rsvpForm
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-CA', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-CA', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const renderRoundtableCard = (roundtable: any, isUpcoming: boolean = true) => {
    const eventDateTime = roundtable.event_date ? formatEventDate(roundtable.event_date) : null;
    const hasRsvped = hasUserRsvped(roundtable.id);

    return (
      <Card key={roundtable.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl leading-tight pr-4">{roundtable.title}</CardTitle>
            <Badge className={isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {isUpcoming ? "Upcoming" : "Past Event"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {roundtable.description && (
            <p className="text-gray-700 mb-4 line-clamp-3">{roundtable.description}</p>
          )}
          
          {eventDateTime && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{eventDateTime.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{eventDateTime.time}</span>
              </div>
            </div>
          )}
          
          {roundtable.max_attendees && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Users className="w-4 h-4" />
              <span>Max {roundtable.max_attendees} attendees</span>
            </div>
          )}
          
          <div className="flex gap-2">
            {isUpcoming && user && !hasRsvped && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedRoundtable(roundtable);
                      setRsvpForm({
                        name: user.user_metadata?.full_name || '',
                        email: user.email || '',
                        organization: ''
                      });
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    RSVP
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>RSVP for {roundtable.title}</DialogTitle>
                    <DialogDescription>
                      Please provide your details to reserve your spot at this roundtable event.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={rsvpForm.organization}
                        onChange={(e) => setRsvpForm({...rsvpForm, organization: e.target.value})}
                        placeholder="Your organization or affiliation"
                      />
                    </div>
                    <Button type="submit" disabled={rsvpMutation.isPending}>
                      {rsvpMutation.isPending ? "Submitting..." : "Submit RSVP"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
            {isUpcoming && hasRsvped && (
              <Button size="sm" variant="outline" className="border-green-600 text-green-600" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                RSVP Confirmed
              </Button>
            )}
            
            {!isUpcoming && roundtable.video_url && (
              <Button size="sm" variant="outline" asChild>
                <a href={roundtable.video_url} target="_blank" rel="noopener noreferrer">
                  <Video className="w-4 h-4 mr-2" />
                  Watch Recording
                </a>
              </Button>
            )}
            
            {!isUpcoming && roundtable.summary && (
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Summary
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            {isUpcoming ? 'Event scheduled for' : 'Held on'} {eventDateTime?.date}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Contributor Roundtables</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Join expert-led discussions on critical AI policy topics. Our roundtables bring together 
              researchers, policymakers, and practitioners to explore emerging challenges and 
              collaborative solutions for Canada's AI governance.
            </p>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
                <h2 className="text-lg font-semibold text-indigo-900">Interactive Policy Discussions</h2>
              </div>
              <p className="text-indigo-800 max-w-3xl mx-auto">
                Each roundtable features structured discussions, expert presentations, and collaborative 
                problem-solving sessions. Participants gain insights from diverse perspectives and 
                contribute to PolicyNow's research agenda.
              </p>
            </div>
          </div>

          {/* Upcoming Roundtables */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            
            {loadingUpcoming ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
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
            ) : upcomingRoundtables && upcomingRoundtables.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingRoundtables.map(roundtable => renderRoundtableCard(roundtable, true))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                  <p className="text-gray-600">
                    We're planning our next roundtable series. Check back soon for upcoming discussions!
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Roundtables */}
          {pastRoundtables && pastRoundtables.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {pastRoundtables.map(roundtable => renderRoundtableCard(roundtable, false))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Roundtables;
