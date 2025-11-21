import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BookRepository, SalesRepository } from "../domain/repository";
import { Book, BookID, SalesEvent } from "../domain/types";

export class SupabaseBookRepository implements BookRepository {
    async createBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from("books")
            .insert({
                profile_id: book.profileId,
                title: book.title,
                subtitle: book.subtitle,
                description: book.description,
                format: book.format,
                status: book.status,
                launch_date: book.launchDate?.toISOString(),
                cover_path: book.coverPath,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return this.mapToDomain(data);
    }

    async updateBook(id: BookID, book: Partial<Book>): Promise<Book> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from("books")
            .update({
                title: book.title,
                subtitle: book.subtitle,
                description: book.description,
                format: book.format,
                status: book.status,
                launch_date: book.launchDate?.toISOString(),
                cover_path: book.coverPath,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return this.mapToDomain(data);
    }

    async deleteBook(id: BookID): Promise<void> {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from("books").delete().eq("id", id);
        if (error) throw new Error(error.message);
    }

    async getBookById(id: BookID): Promise<Book | null> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.from("books").select("*").eq("id", id).single();
        if (error || !data) return null;
        return this.mapToDomain(data);
    }

    async getBooksByProfileId(profileId: string): Promise<Book[]> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.from("books").select("*").eq("profile_id", profileId);
        if (error) throw new Error(error.message);
        return data.map(this.mapToDomain);
    }

    private mapToDomain(data: any): Book {
        return {
            id: data.id,
            profileId: data.profile_id,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            format: data.format,
            status: data.status,
            launchDate: data.launch_date ? new Date(data.launch_date) : undefined,
            coverPath: data.cover_path,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}

export class SupabaseSalesRepository implements SalesRepository {
    async recordSale(sale: Omit<SalesEvent, "id">): Promise<void> {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from("sales_events").insert({
            profile_id: sale.profileId,
            platform: sale.platform,
            event_type: sale.eventType,
            quantity: sale.quantity,
            amount: sale.amount,
            currency: sale.currency,
            occurred_at: sale.occurredAt.toISOString(),
            raw_payload: sale.rawPayload,
        });
        if (error) throw new Error(error.message);
    }

    async getSalesByProfileId(profileId: string, range?: { start: Date; end: Date }): Promise<SalesEvent[]> {
        const supabase = await createSupabaseServerClient();
        let query = supabase.from("sales_events").select("*").eq("profile_id", profileId);

        if (range) {
            query = query.gte("occurred_at", range.start.toISOString()).lte("occurred_at", range.end.toISOString());
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        return data.map((d: any) => ({
            id: d.id,
            profileId: d.profile_id,
            platform: d.platform,
            eventType: d.event_type,
            quantity: d.quantity,
            amount: d.amount,
            currency: d.currency,
            occurredAt: new Date(d.occurred_at),
            rawPayload: d.raw_payload,
        }));
    }
}
