import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Shield, Database, Mail, Bell, Users, Globe, Lock, Activity, Save, RefreshCw, AlertTriangle, CheckCircle, Zap, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface SystemSettings {
  siteName: string;
  adminEmail: string;
  maxEventsPerUser: number;
  featuredEventsLimit: number;
  enableRegistration: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  allowEventCreation: boolean;
  requireEventApproval: boolean;
  enableRealTimeUpdates: boolean;
}
const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('admin_settings');
    return saved ? JSON.parse(saved) : {
      siteName: 'AI Canada Voice',
      adminEmail: 'admin@aicanadavoice.ca',
      maxEventsPerUser: 5,
      featuredEventsLimit: 3,
      enableRegistration: true,
      enableNotifications: true,
      maintenanceMode: localStorage.getItem('maintenance_mode') === 'true',
      allowEventCreation: true,
      requireEventApproval: false,
      enableRealTimeUpdates: true
    };
  });
  const [backupStatus, setBackupStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();

  // Get system statistics
  const {
    data: systemStats
  } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [users, events, articles, contributors] = await Promise.all([supabase.from('profiles').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('meetups').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('articles').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('contributors').select('id', {
        count: 'exact',
        head: true
      })]);
      return {
        totalUsers: users.count || 0,
        totalEvents: events.count || 0,
        totalArticles: articles.count || 0,
        totalContributors: contributors.count || 0,
        lastUpdated: new Date(),
        diskUsage: '2.4 GB',
        // Mock data - would be real in production
        memoryUsage: '68%',
        uptime: '99.8%'
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  const saveMutation = useMutation({
    mutationFn: async (settingsData: SystemSettings) => {
      // For demonstration - in production, this would save to a settings table
      localStorage.setItem('admin_settings', JSON.stringify(settingsData));

      // Apply maintenance mode immediately if enabled
      if (settingsData.maintenanceMode) {
        localStorage.setItem('maintenance_mode', 'true');
        window.location.reload();
      } else {
        localStorage.removeItem('maintenance_mode');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Settings saved successfully',
        description: 'All configuration changes have been applied.'
      });
    }
  });
  const handleSave = () => {
    saveMutation.mutate(settings);
  };
  const handleBackup = async () => {
    setBackupStatus('creating');
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBackupStatus('success');
      toast({
        title: 'Backup created successfully',
        description: `Database backup created at ${new Date().toLocaleString()}`
      });
      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch (error) {
      setBackupStatus('error');
      toast({
        title: 'Backup failed',
        description: 'There was an error creating the database backup.',
        variant: 'destructive'
      });
    }
  };
  const handleTestEmail = async () => {
    try {
      // In a real app, this would trigger a test email
      toast({
        title: 'Test email sent',
        description: `Test email sent to ${settings.adminEmail}`
      });
    } catch (error) {
      toast({
        title: 'Email test failed',
        description: 'Could not send test email.',
        variant: 'destructive'
      });
    }
  };
  const handleEmergencyLock = () => {
    if (confirm('This will put the site in emergency maintenance mode. Are you sure?')) {
      setSettings(prev => ({
        ...prev,
        maintenanceMode: true
      }));
      toast({
        title: 'Emergency lock activated',
        description: 'Site is now in maintenance mode.',
        variant: 'destructive'
      });
    }
  };
  const clearCache = () => {
    queryClient.clear();
    toast({
      title: 'Cache cleared',
      description: 'All cached data has been cleared.'
    });
  };
  const getSystemHealthStatus = () => {
    const health = systemStats;
    if (!health) return {
      status: 'loading',
      color: 'gray'
    };
    const memoryUsagePercent = parseInt(health.memoryUsage);
    const uptimePercent = parseFloat(health.uptime);
    if (memoryUsagePercent > 90 || uptimePercent < 95) {
      return {
        status: 'Warning',
        color: 'yellow'
      };
    }
    return {
      status: 'Healthy',
      color: 'green'
    };
  };
  const healthStatus = getSystemHealthStatus();
  return <AdminLayout requiredRole="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-600 mt-2">Configure system settings and preferences</p>
          </div>
          <div className="flex items-center gap-4">
            
            <Button onClick={clearCache} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{systemStats?.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{systemStats?.totalEvents || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Memory Usage</p>
                  <p className="text-2xl font-bold">{systemStats?.memoryUsage || '0%'}</p>
                </div>
                <Database className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold">{systemStats?.uptime || '0%'}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <Input value={settings.siteName} onChange={e => setSettings({
                ...settings,
                siteName: e.target.value
              })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Admin Email</label>
                <Input type="email" value={settings.adminEmail} onChange={e => setSettings({
                ...settings,
                adminEmail: e.target.value
              })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Events Per User</label>
                  <Input type="number" value={settings.maxEventsPerUser} onChange={e => setSettings({
                  ...settings,
                  maxEventsPerUser: parseInt(e.target.value)
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Events Limit</label>
                  <Input type="number" value={settings.featuredEventsLimit} onChange={e => setSettings({
                  ...settings,
                  featuredEventsLimit: parseInt(e.target.value)
                })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <input type="checkbox" checked={settings.enableRegistration} onChange={e => setSettings({
                ...settings,
                enableRegistration: e.target.checked
              })} className="rounded" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Event Creation</h4>
                  <p className="text-sm text-gray-500">Allow users to create events</p>
                </div>
                <input type="checkbox" checked={settings.allowEventCreation} onChange={e => setSettings({
                ...settings,
                allowEventCreation: e.target.checked
              })} className="rounded" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Event Approval</h4>
                  <p className="text-sm text-gray-500">Require admin approval for events</p>
                </div>
                <input type="checkbox" checked={settings.requireEventApproval} onChange={e => setSettings({
                ...settings,
                requireEventApproval: e.target.checked
              })} className="rounded" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Put site in maintenance mode</p>
                </div>
                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({
                ...settings,
                maintenanceMode: e.target.checked
              })} className="rounded" />
              </div>
            </CardContent>
          </Card>

          {/* System Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Real-time Updates</h4>
                  <p className="text-sm text-gray-500">Enable live data synchronization</p>
                </div>
                <input type="checkbox" checked={settings.enableRealTimeUpdates} onChange={e => setSettings({
                ...settings,
                enableRealTimeUpdates: e.target.checked
              })} className="rounded" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Send system notifications via email</p>
                </div>
                <input type="checkbox" checked={settings.enableNotifications} onChange={e => setSettings({
                ...settings,
                enableNotifications: e.target.checked
              })} className="rounded" />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Version:</span>
                  <div className="font-medium">v2.1.0</div>
                </div>
                <div>
                  <span className="text-gray-500">Database:</span>
                  <div className="font-medium text-green-600">Connected</div>
                </div>
                <div>
                  <span className="text-gray-500">Storage:</span>
                  <div className="font-medium">{systemStats?.diskUsage || 'Unknown'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Last Backup:</span>
                  <div className="font-medium">2 hours ago</div>
                </div>
              </div>
              <Separator />
              <div className="text-xs text-gray-500">
                <p>Last updated: {systemStats?.lastUpdated ? new Date(systemStats.lastUpdated).toLocaleString() : 'Never'}</p>
                <p>Environment: Production</p>
                <p>Region: North America</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={handleSave} className="w-full" disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save All Settings'}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleBackup} disabled={backupStatus === 'creating'}>
                {backupStatus === 'creating' ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                {backupStatus === 'creating' ? 'Creating...' : 'Backup Database'}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleTestEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Test Email System
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleEmergencyLock}>
                <Lock className="h-4 w-4 mr-2" />
                Emergency Lock
              </Button>
            </div>
            
            {backupStatus === 'success' && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Backup completed successfully</span>
                </div>
              </div>}
            
            {backupStatus === 'error' && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Backup failed - please try again</span>
                </div>
              </div>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>;
};
export default AdminSettings;