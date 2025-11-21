"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { services } from "@/lib/services";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bookSchema = z.object({
    title: z.string().min(2),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    format: z.enum(["ebook", "paperback", "hardcover", "audiobook"]),
    status: z.enum(["draft", "scheduled", "live"]).default("draft"),
    launch_date: z
        .string()
        .optional()
        .transform((value) => (value ? new Date(value) : undefined)),
});

type ActionResponse = {
    success: boolean;
    message: string;
};

export async function createBookAction(formData: FormData): Promise<ActionResponse> {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const payload = bookSchema.safeParse({
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        description: formData.get("description"),
        format: formData.get("format"),
        status: formData.get("status") ?? "draft",
        launch_date: formData.get("launchDate"),
    });

    if (!payload.success) {
        return {
            success: false,
            message: payload.error.issues[0]?.message ?? "Invalid book data.",
        };
    }

    const coverFile = formData.get("cover") as File | null;
    let coverPath: string | undefined = undefined;

    if (coverFile && coverFile.size > 0) {
        const { data: uploadResult, error: uploadError } = await supabase.storage
            .from("book-covers")
            .upload(`${user.id}/${crypto.randomUUID()}-${coverFile.name}`, coverFile, {
                upsert: false,
                contentType: coverFile.type || "image/png",
            });

        if (uploadError) {
            return { success: false, message: uploadError.message };
        }

        coverPath = uploadResult?.path;
    }

    try {
        await services.book.createBook({
            profileId: user.id,
            title: payload.data.title,
            subtitle: payload.data.subtitle,
            description: payload.data.description,
            format: payload.data.format,
            status: payload.data.status as any, // Cast to match domain type
            launchDate: payload.data.launch_date,
            coverPath: coverPath,
        });
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/books");
    return { success: true, message: "Book created." };
}

export async function updateBookAction(formData: FormData): Promise<ActionResponse> {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const bookId = formData.get("bookId")?.toString();

    if (!bookId) {
        return { success: false, message: "Missing book ID." };
    }

    const payload = bookSchema.safeParse({
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        description: formData.get("description"),
        format: formData.get("format"),
        status: formData.get("status") ?? "draft",
        launch_date: formData.get("launchDate"),
    });

    if (!payload.success) {
        return {
            success: false,
            message: payload.error.issues[0]?.message ?? "Invalid book data.",
        };
    }

    const coverFile = formData.get("cover") as File | null;
    let coverPath: string | undefined;

    if (coverFile && coverFile.size > 0) {
        const { data: uploadResult, error: uploadError } = await supabase.storage
            .from("book-covers")
            .upload(`${user.id}/${crypto.randomUUID()}-${coverFile.name}`, coverFile, {
                upsert: false,
                contentType: coverFile.type || "image/png",
            });

        if (uploadError) {
            return { success: false, message: uploadError.message };
        }

        coverPath = uploadResult?.path;
    }

    try {
        await services.book.updateBook(bookId, {
            title: payload.data.title,
            subtitle: payload.data.subtitle,
            description: payload.data.description,
            format: payload.data.format,
            status: payload.data.status as any,
            launchDate: payload.data.launch_date,
            ...(coverPath !== undefined ? { coverPath } : {}),
        });
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/books");
    revalidatePath(`/dashboard/books/${bookId}`);
    return { success: true, message: "Book updated." };
}

export async function deleteBookAction(bookId: string) {
    const user = await requireAuth();
    // We should probably handle cover deletion here too, but BookService doesn't expose it yet.
    // For now, just delete the record.
    await services.book.deleteBook(bookId);
    revalidatePath("/dashboard/books");
}
