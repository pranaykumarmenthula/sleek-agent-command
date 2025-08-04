-- Create a function to handle OAuth provider tokens and store them encrypted
CREATE OR REPLACE FUNCTION public.handle_oauth_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    provider_name text;
    encrypted_token text;
    user_identity_data jsonb;
BEGIN
    -- Only process Google OAuth tokens
    IF NEW.provider = 'google' AND NEW.provider_token IS NOT NULL THEN
        provider_name := 'google';
        user_identity_data := NEW.identity_data;
        
        -- Encrypt the token data using the ENCRYPTION_KEY
        -- We'll store both access_token and refresh_token
        encrypted_token := encode(
            encrypt(
                jsonb_build_object(
                    'access_token', NEW.provider_token,
                    'refresh_token', NEW.provider_refresh_token,
                    'expires_at', NEW.expires_at,
                    'identity_data', user_identity_data
                )::text::bytea,
                decode(split_part(vault.read_secret('ENCRYPTION_KEY'), '.', 1), 'base64'),
                'aes'
            ),
            'base64'
        );
        
        -- Insert or update the connected account
        INSERT INTO public.connected_accounts (user_id, provider, encrypted_token_data)
        VALUES (NEW.user_id, provider_name, encrypted_token)
        ON CONFLICT (user_id, provider) 
        DO UPDATE SET 
            encrypted_token_data = EXCLUDED.encrypted_token_data,
            created_at = now();
            
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically handle OAuth tokens
DROP TRIGGER IF EXISTS on_auth_identity_created ON auth.identities;
CREATE TRIGGER on_auth_identity_created
  AFTER INSERT OR UPDATE ON auth.identities
  FOR EACH ROW EXECUTE FUNCTION public.handle_oauth_token();