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
      // Store the current user info to link accounts later
      const currentUser = user;
      
      // This will redirect to Google OAuth and then back to our app
      const { error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.compose',
          redirectTo: `${window.location.origin}/setup`
        }
      });

      if (error) {
        console.error('Error connecting Google account:', error);
        toast.error('Failed to connect Google account: ' + error.message);
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