import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const noteSchema = z.object({
  bookId: z.string().uuid().optional(),
  noteType: z.enum(["observation", "goal", "experiment", "outcome"]).default("observation"),
  content: z.string().min(1).max(5000),
  tags: z.array(z.string()).default([]),
});

/**
 * POST /api/ai/notes
 * Create a user note for AI context
 */
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    
    const body = await req.json();
    const parsed = noteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { bookId, noteType, content, tags } = parsed.data;

    const { data: note, error } = await supabase
      .from("user_notes")
      .insert({
        profile_id: user.id,
        book_id: bookId,
        note_type: noteType,
        content,
        tags,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: { note },
    });
  } catch (error: any) {
    console.error("Note creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/notes?bookId=<uuid>&tags=tag1,tag2
 * Get user notes
 */
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    
    const bookId = searchParams.get("bookId");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    let query = supabase
      .from("user_notes")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (bookId) {
      query = query.eq("book_id", bookId);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    const { data: notes, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: { notes: notes || [] },
    });
  } catch (error: any) {
    console.error("Notes fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/notes/:id
 * Delete a user note
 */
export async function DELETE(req: Request) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);
    
    const noteId = searchParams.get("id");
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("user_notes")
      .delete()
      .eq("id", noteId)
      .eq("profile_id", user.id);

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error: any) {
    console.error("Note deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete note" },
      { status: 500 }
    );
  }
}
