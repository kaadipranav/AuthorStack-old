"use client";

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Supabase client (server side)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function GoogleSignInButton() {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) {
            console.error('Google sign‑in error:', error);
            return;
        }
        router.push('/dashboard');
    };

    return (
        <Button onClick={handleGoogleSignIn} variant="outline" className="flex items-center gap-2">
            Sign in with Google
        </Button>
    );
}
