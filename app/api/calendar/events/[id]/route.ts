import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id: eventId } = await params;

        const { data, error } = await supabase
            .from("calendar_events")
            .update(body)
            .eq("id", eventId)
            .eq("profile_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("[Calendar] Error updating event:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ event: data });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Calendar] Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;

        const { error } = await supabase
            .from("calendar_events")
            .delete()
            .eq("id", eventId)
            .eq("profile_id", user.id);

        if (error) {
            console.error("[Calendar] Error deleting event:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Calendar] Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
