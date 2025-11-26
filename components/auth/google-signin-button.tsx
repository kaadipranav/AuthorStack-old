"use client";

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function GoogleSignInButton() {
    const handleGoogleSignIn = async () => {
        const supabase = createSupabaseBrowserClient();
        
        const { error } = await supabase.auth.signInWithOAuth({ 
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) {
            console.error('Google sign‑in error:', error);
            return;
        }
    };

    return (
        <Button onClick={handleGoogleSignIn} variant="outline" className="flex items-center gap-2">
            Sign in with Google
        </Button>
    );
}
