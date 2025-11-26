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
        const { id: testId } = await params;

        const { data, error } = await supabase
            .from("ab_tests")
            .update(body)
            .eq("id", testId)
            .eq("profile_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("[AB Tests] Error updating test:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }

        return NextResponse.json({ test: data });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[AB Tests] Error:", errorMessage);
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

        const { id: testId } = await params;

        const { error } = await supabase
            .from("ab_tests")
            .delete()
            .eq("id", testId)
            .eq("profile_id", user.id);

        if (error) {
            console.error("[AB Tests] Error deleting test:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[AB Tests] Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
