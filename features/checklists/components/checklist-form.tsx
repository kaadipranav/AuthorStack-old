"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createChecklistAction,
  updateChecklistTaskAction,
} from "@/lib/checklists/actions";

type ChecklistFormProps = {
  mode?: "create" | "update";
  checklistId?: string;
  defaultValues?: {
    name?: string | null;
    launch_date?: string | null;
    notes?: string | null;
  };
};

export function ChecklistForm({
  mode = "create",
  checklistId,
  defaultValues,
}: ChecklistFormProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    const action = mode === "create" ? createChecklistAction : updateChecklistTaskAction;
    if (checklistId) {
      formData.set("checklistId", checklistId);
    }
    const result = await action(formData);
    setMessage(result.message);
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Launch name</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="launchDate">Target launch date</Label>
        <Input id="launchDate" name="launchDate" type="date" defaultValue={defaultValues?.launch_date ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={defaultValues?.notes ?? ""} />
      </div>
      {message ? <p className="text-sm text-charcoal">{message}</p> : null}
      <FormSubmit pendingLabel={mode === "create" ? "Creating..." : "Updating..."}>
        {mode === "create" ? "Create checklist" : "Update checklist"}
      </FormSubmit>
    </form>
  );
}
