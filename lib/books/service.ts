import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";

export type BookRecord = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  format: string;
  status: string;
  launch_date?: string | null;
  cover_path?: string | null;
  platforms: string[];
  created_at: string;
  updated_at: string;
};

export async function listBooks(): Promise<BookRecord[]> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    
    // Log the query for debugging
    console.log("Fetching books for user:", user.id);
    
    // Use explicit column names instead of *
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        subtitle,
        description,
        format,
        status,
        launch_date,
        cover_path,
        platforms,
        created_at,
        updated_at
      `)
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
    
    console.log("Books fetched successfully:", data?.length || 0);
    return data ?? [];
  } catch (error) {
    console.error("Error in listBooks:", error);
    throw error;
  }
}

export async function getBook(bookId: string): Promise<BookRecord | null> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    
    // Use explicit column names instead of *
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        title,
        subtitle,
        description,
        format,
        status,
        launch_date,
        cover_path,
        platforms,
        created_at,
        updated_at
      `)
      .eq("id", bookId)
      .eq("profile_id", user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
    
    return data ?? null;
  } catch (error) {
    console.error("Error in getBook:", error);
    throw error;
  }
}