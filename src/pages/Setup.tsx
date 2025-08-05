import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GoogleAccountSetup } from "@/components/GoogleAccountSetup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export const Setup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasGoogleAccount, setHasGoogleAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    checkGoogleConnection();
  }, [user, navigate]);

  // Listen for auth state changes to refresh Google connection status
  useEffect(() => {
    if (!user) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          // Delay to allow any triggers to complete
          setTimeout(() => {
            checkGoogleConnection();
          }, 2000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [user]);

  const checkGoogleConnection = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle(); // Use maybeSingle to avoid error when no record exists

      if (error) {
        console.error('Error checking Google connection:', error);
        toast.error('Failed to check Google connection status');
        setHasGoogleAccount(false);
      } else {
        setHasGoogleAccount(!!data);
        console.log('Google connection status:', !!data);
      }
    } catch (error) {
      console.error('Error:', error);
      setHasGoogleAccount(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (hasGoogleAccount) {
      navigate('/');
      toast.success('Setup complete! You can now use the AI assistant.');
    } else {
      toast.error('Please connect your Google account first');
    }
  };

  const setupSteps = [
    {
      title: 'Connect Google Account',
      description: 'Allow access to Gmail and Calendar for AI automation',
      status: hasGoogleAccount ? 'completed' : 'pending',
      component: !hasGoogleAccount ? <GoogleAccountSetup /> : null
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Checking your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to AI Agent
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Let's set up your account to enable AI automation
          </p>
        </div>

        <div className="space-y-6">
          {setupSteps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : step.status === 'pending' ? (
                    <Clock className="w-6 h-6 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {step.component && (
                <CardContent>
                  {step.component}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {hasGoogleAccount && (
          <div className="mt-8 text-center">
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                  Setup Complete!
                </h3>
                <p className="text-green-700 dark:text-green-400 mb-4">
                  Your Google account is connected and ready for AI automation.
                </p>
                <Button 
                  onClick={handleContinue}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Start Using AI Agent
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-slate-600 dark:text-slate-300"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setup;