"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/auth/actions";

export function SignUpForm() {
  const [message, setMessage] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const result = await signUpAction(formData);
    if (result) {
      setMessage(result.message);
    }
  }

  return (
    <form action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>
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
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <FormSubmit pendingLabel="Creating account...">Create account</FormSubmit>
    </form>
  );
}

