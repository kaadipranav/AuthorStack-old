"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectPlatformAction,
  uploadKdpReportAction,
} from "@/lib/platforms/actions";

type PlatformConnectFormProps = {
  provider: string;
};

export function PlatformConnectForm({ provider }: PlatformConnectFormProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    formData.append("provider", provider);
    const result = await connectPlatformAction(formData);
    setMessage(result.message);
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${provider}-apiKey`}>API key / token</Label>
        <Input id={`${provider}-apiKey`} name="apiKey" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${provider}-accountId`}>Account identifier</Label>
        <Input id={`${provider}-accountId`} name="accountId" />
      </div>
      {message ? <p className="text-sm text-charcoal">{message}</p> : null}
      <FormSubmit pendingLabel="Connecting...">Connect {provider}</FormSubmit>
    </form>
  );
}

export function KdpUploadForm() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(formData: FormData) {
    const result = await uploadKdpReportAction(formData);
    setMessage(result.message);
  }

  return (
    <form action={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kdpCsv">Upload Amazon KDP CSV</Label>
        <Input id="kdpCsv" name="file" type="file" accept=".csv" required />
      </div>
      {message ? <p className="text-sm text-charcoal">{message}</p> : null}
      <FormSubmit pendingLabel="Uploading...">Upload CSV</FormSubmit>
    </form>
  );
}

