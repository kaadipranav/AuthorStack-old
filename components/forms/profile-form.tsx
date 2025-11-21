"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/app/(dashboard)/dashboard/profile/actions";

type ProfileFormProps = {
  defaultValues: {
    full_name: string | null;
    avatar_url: string | null;
    subscription_tier: string | null;
  };
};

const subscriptionOptions = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const result = await updateProfileAction(formData);
    setMessage(result.message);
  }

  return (
    <form action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultValues.full_name ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          placeholder="https://"
          defaultValue={defaultValues.avatar_url ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subscription_tier">Subscription tier</Label>
        <select
          id="subscription_tier"
          name="subscription_tier"
          className="h-10 w-full rounded-lg border border-stroke bg-surface px-3 text-body shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          defaultValue={defaultValues.subscription_tier ?? "free"}
        >
          {subscriptionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {message ? <p className="text-sm text-charcoal">{message}</p> : null}
      <FormSubmit pendingLabel="Saving changes...">Save profile</FormSubmit>
    </form>
  );
}

