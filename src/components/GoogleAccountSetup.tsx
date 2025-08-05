import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const GoogleAccountSetup: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  const handleConnectGoogle = async () => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setIsConnecting(true);
    try {
      // Use signInWithOAuth to get Google tokens with the required scopes
      // This will redirect to Google and then back to our app
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose',
          redirectTo: `${window.location.origin}/setup`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Error connecting Google account:', error);
        if (error.message?.includes('Unsupported provider')) {
          toast.error('Google OAuth is not enabled. Please enable Google provider in Supabase Dashboard → Authentication → Providers');
        } else if (error.message?.includes('Manual linking is disabled')) {
          toast.error('Please enable manual account linking in Supabase Dashboard → Authentication → Settings');
        } else {
          toast.error('Failed to connect Google account: ' + error.message);
        }
      } else {
        toast.success('Redirecting to Google for authorization...');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Google Account</CardTitle>
        <CardDescription>
          Connect your Google account to enable AI automation features like calendar management and email handling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleConnectGoogle}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Google Account'}
        </Button>
      </CardContent>
    </Card>
  );
};