-- Fix the OAuth token handling trigger to work with auth.identities table structure
DROP TRIGGER IF EXISTS on_auth_identity_created ON auth.identities;
DROP FUNCTION IF EXISTS public.handle_oauth_token();

-- Create a simpler function that works with the actual auth.identities structure
CREATE OR REPLACE FUNCTION public.handle_oauth_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only process Google OAuth tokens and only on INSERT
    IF TG_OP = 'INSERT' AND NEW.provider = 'google' THEN
        -- Store a placeholder for now - we'll update this when we get proper token handling
        INSERT INTO public.connected_accounts (user_id, provider, encrypted_token_data)
        VALUES (NEW.user_id, 'google', 'placeholder_token_data')
        ON CONFLICT (user_id, provider) 
        DO UPDATE SET 
            encrypted_token_data = EXCLUDED.encrypted_token_data,
            created_at = now();
            
        -- Log for debugging
        RAISE LOG 'Google account connected for user: %', NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically handle OAuth identity creation
CREATE TRIGGER on_auth_identity_created
  AFTER INSERT ON auth.identities
  FOR EACH ROW EXECUTE FUNCTION public.handle_oauth_token();

-- Add unique constraint to prevent duplicate connected accounts
ALTER TABLE public.connected_accounts 
ADD CONSTRAINT unique_user_provider UNIQUE (user_id, provider);