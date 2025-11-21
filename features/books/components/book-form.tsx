"use client";

import { useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBookAction, updateBookAction } from "@/app/(dashboard)/dashboard/books/actions";

type BookFormProps = {
  mode?: "create" | "edit";
  bookId?: string;
  defaultValues?: {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    format?: string | null;
    status?: string | null;
    launch_date?: string | null;
  };
};

const formatOptions = [
  { value: "ebook", label: "eBook" },
  { value: "paperback", label: "Paperback" },
  { value: "hardcover", label: "Hardcover" },
  { value: "audiobook", label: "Audiobook" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
];

export function BookForm({ mode = "create", bookId, defaultValues }: BookFormProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    const action = mode === "create" ? createBookAction : updateBookAction;
    if (bookId) {
      formData.set("bookId", bookId);
    }
    const result = await action(formData);
    setMessage(result.message);
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={defaultValues?.title ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" defaultValue={defaultValues?.subtitle ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <select
          id="format"
          name="format"
          className="h-10 w-full rounded-lg border border-stroke bg-surface px-3 text-body shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          defaultValue={defaultValues?.format ?? "ebook"}
        >
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="h-10 w-full rounded-lg border border-stroke bg-surface px-3 text-body shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          defaultValue={defaultValues?.status ?? "draft"}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="launchDate">Launch date</Label>
        <Input
          id="launchDate"
          name="launchDate"
          type="date"
          defaultValue={defaultValues?.launch_date ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover">Cover image</Label>
        <Input id="cover" name="cover" type="file" accept="image/*" />
      </div>
      {message ? <p className="text-sm text-charcoal">{message}</p> : null}
      <FormSubmit pendingLabel={mode === "create" ? "Creating..." : "Saving..."}>
        {mode === "create" ? "Create book" : "Save changes"}
      </FormSubmit>
    </form>
  );
}

