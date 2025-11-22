"use client";

import { useState } from "react";
import { User } from "lucide-react";

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
  const [avatarUrl, setAvatarUrl] = useState(defaultValues.avatar_url ?? "");

  async function clientAction(formData: FormData) {
    const result = await updateProfileAction(formData);
    setMessage(result.message);
  }

  return (
    <form action={clientAction} className="space-y-6">
      {/* Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-stroke shadow-md"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div className={`w-24 h-24 rounded-full bg-glass border-2 border-stroke flex items-center justify-center ${avatarUrl ? "hidden" : ""}`}>
            <User className="w-12 h-12 text-charcoal" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-ink mb-1">Profile Picture</p>
          <p className="text-xs text-charcoal">
            Enter a URL to your profile image below
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultValues.full_name ?? ""}
          placeholder="Enter your full name"
          className="border-stroke focus-visible:ring-burgundy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          defaultValue={defaultValues.avatar_url ?? ""}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="border-stroke focus-visible:ring-burgundy"
        />
        <p className="text-xs text-charcoal">
          Paste a link to an image hosted online (e.g., Gravatar, Imgur, or your own server)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subscription_tier">Subscription tier</Label>
        <select
          id="subscription_tier"
          name="subscription_tier"
          className="h-10 w-full rounded-lg border border-stroke bg-surface px-3 text-body shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy transition-colors"
          defaultValue={defaultValues.subscription_tier ?? "free"}
        >
          {subscriptionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-charcoal">
          Your current subscription level
        </p>
      </div>

      {message ? (
        <div className="p-3 rounded-lg bg-glass border border-stroke">
          <p className="text-sm text-ink">{message}</p>
        </div>
      ) : null}

      <FormSubmit pendingLabel="Saving changes..." className="w-full bg-burgundy hover:bg-burgundy/90">
        Save profile
      </FormSubmit>
    </form>
  );
}
