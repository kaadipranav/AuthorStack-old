"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/lib/auth/actions";

export function SignInForm() {
  const [message, setMessage] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const result = await signInAction(formData);
    if (result) {
      setMessage(result.message);
    }
  }

  return (
    <form action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <FormSubmit pendingLabel="Signing in...">Sign in</FormSubmit>
    </form>
  );
}
