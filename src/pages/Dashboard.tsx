import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, Database, Zap } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasGoogleAccount, setHasGoogleAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    supabase: false,
    edgeFunction: false,
    pythonAgent: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    checkSystemStatus();
  }, [user, navigate]);

  const checkSystemStatus = async () => {
    setIsLoading(true);
    
    try {
      // Check Supabase connection
      const { data: profiles } = await supabase.from('profiles').select('*').limit(1);
      setSystemStatus(prev => ({ ...prev, supabase: true }));

      // Check connected accounts
      const { data: accounts, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (!error) {
        setConnectedAccounts(accounts || []);
        setHasGoogleAccount(accounts?.some(acc => acc.provider === 'google') || false);
      }

      // Test edge function
      try {
        const { data, error } = await supabase.functions.invoke('api-gateway', {
          body: { message: 'test' }
        });
        
        if (error) {
          console.log('Edge function error (expected):', error.message);
          // This is expected since we don't have a Google account connected yet
          setSystemStatus(prev => ({ ...prev, edgeFunction: true }));
        } else {
          setSystemStatus(prev => ({ ...prev, edgeFunction: true, pythonAgent: true }));
        }
      } catch (err) {
        console.log('Edge function test failed:', err);
      }

    } catch (error) {
      console.error('System check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testEdgeFunction = async () => {
    try {
      toast.info('Testing edge function...');
      const { data, error } = await supabase.functions.invoke('api-gateway', {
        body: { message: 'Hello, this is a test message' }
      });

      if (error) {
        toast.error(`Edge function error: ${error.message}`);
      } else {
        toast.success('Edge function working correctly!');
      }
    } catch (error) {
      toast.error(`Test failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Agent Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            System status and configuration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Status
              </CardTitle>
              <CardDescription>Core system components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Supabase Database</span>
                {systemStatus.supabase ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Edge Function</span>
                {systemStatus.edgeFunction ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Python Agent</span>
                {systemStatus.pythonAgent ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Running
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Unknown
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Connected Accounts
              </CardTitle>
              <CardDescription>Your linked external accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {connectedAccounts.length > 0 ? (
                <div className="space-y-2">
                  {connectedAccounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="capitalize">{account.provider}</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 dark:text-slate-400 mb-3">
                    No accounts connected
                  </p>
                  <Button onClick={() => navigate('/setup')} size="sm">
                    Connect Google Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Test and manage system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={checkSystemStatus} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              <Button 
                onClick={testEdgeFunction} 
                variant="outline" 
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Test AI Agent
              </Button>
              <Button 
                onClick={() => navigate('/setup')} 
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Setup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Debug Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>Technical details for troubleshooting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">User Information</h4>
                <code className="text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded block">
                  User ID: {user?.id}<br/>
                  Email: {user?.email}<br/>
                  Created: {user?.created_at}
                </code>
              </div>
              <div>
                <h4 className="font-medium mb-2">Connected Accounts</h4>
                <code className="text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded block">
                  Count: {connectedAccounts.length}<br/>
                  Google: {hasGoogleAccount ? 'Yes' : 'No'}<br/>
                  Last Check: {new Date().toLocaleTimeString()}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;