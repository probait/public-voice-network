import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, Settings, Download, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface NewsletterSettings {
  id: string;
  popup_enabled: boolean;
  popup_delay_seconds: number;
  popup_frequency_days: number;
  beehiv_publication_id: string | null;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [settings, setSettings] = useState<NewsletterSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (subscribersError) throw subscribersError;

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("newsletter_settings")
        .select("*")
        .limit(1)
        .single();

      if (settingsError) throw settingsError;

      setSubscribers(subscribersData || []);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading newsletter data:", error);
      toast({
        title: "Error",
        description: "Failed to load newsletter data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<NewsletterSettings>) => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from("newsletter_settings")
        .update(newSettings)
        .eq("id", settings.id);

      if (error) throw error;

      setSettings({ ...settings, ...newSettings });
      toast({
        title: "Settings updated",
        description: "Newsletter settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscribers(subscribers.filter(sub => sub.id !== id));
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been removed from the list.",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        variant: "destructive",
      });
    }
  };

  const exportSubscribers = () => {
    const csv = [
      "Email,Status,Source,Subscribed At",
      ...subscribers.map(sub => 
        `${sub.email},${sub.status},${sub.source},${format(new Date(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss')}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(sub => sub.status === "pending" || sub.status === "active").length,
    unsubscribed: subscribers.filter(sub => sub.status === "unsubscribed").length,
  };

  if (loading) {
    return <div className="p-6">Loading newsletter data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Newsletter Management</h1>
        <Button onClick={exportSubscribers} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Subscribers
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unsubscribed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers List</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Subscribed At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.status === "active" || subscriber.status === "pending" ? "default" : "secondary"}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscriber.source}</TableCell>
                      <TableCell>{format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubscriber(subscriber.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Popup Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="popup-enabled"
                  checked={settings?.popup_enabled || false}
                  onCheckedChange={(checked) => updateSettings({ popup_enabled: checked })}
                />
                <Label htmlFor="popup-enabled">Enable newsletter popup</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="popup-delay">Popup delay (seconds)</Label>
                  <Input
                    id="popup-delay"
                    type="number"
                    value={settings?.popup_delay_seconds || 5}
                    onChange={(e) => updateSettings({ popup_delay_seconds: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="popup-frequency">Show again after (days)</Label>
                  <Input
                    id="popup-frequency"
                    type="number"
                    value={settings?.popup_frequency_days || 7}
                    onChange={(e) => updateSettings({ popup_frequency_days: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beehiv-id">Beehiv Publication ID</Label>
                <Input
                  id="beehiv-id"
                  placeholder="Enter your Beehiv publication ID"
                  value={settings?.beehiv_publication_id || ""}
                  onChange={(e) => updateSettings({ beehiv_publication_id: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}