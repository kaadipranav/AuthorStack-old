import { BookRepository, SalesRepository } from "../domain/repository";
import { Book, BookID, SalesEvent } from "../domain/types";

export class BookService {
    constructor(private readonly bookRepository: BookRepository) { }

    async createBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> {
        return this.bookRepository.createBook(book);
    }

    async updateBook(id: BookID, book: Partial<Book>): Promise<Book> {
        return this.bookRepository.updateBook(id, book);
    }

    async deleteBook(id: BookID): Promise<void> {
        return this.bookRepository.deleteBook(id);
    }

    async getBookById(id: BookID): Promise<Book | null> {
        return this.bookRepository.getBookById(id);
    }

    async getMyBooks(profileId: string): Promise<Book[]> {
        return this.bookRepository.getBooksByProfileId(profileId);
    }
}

export class SalesService {
    constructor(private readonly salesRepository: SalesRepository) { }

    async recordSale(sale: Omit<SalesEvent, "id">): Promise<void> {
        return this.salesRepository.recordSale(sale);
    }

    async getSalesStats(profileId: string): Promise<{ totalRevenue: number; totalUnits: number }> {
        const sales = await this.salesRepository.getSalesByProfileId(profileId);
        const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
        const totalUnits = sales.reduce((acc, sale) => acc + sale.quantity, 0);
        return { totalRevenue, totalUnits };
    }

    async getDailySales(profileId: string, days: number = 30): Promise<Array<{ date: string; amount: number }>> {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        const sales = await this.salesRepository.getSalesByProfileId(profileId, { start, end });

        // Group by date
        const salesByDate = new Map<string, number>();

        // Initialize all days with 0
        for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            salesByDate.set(d.toISOString().split('T')[0], 0);
        }

        sales.forEach(sale => {
            const dateKey = sale.occurredAt.toISOString().split('T')[0];
            if (salesByDate.has(dateKey)) {
                salesByDate.set(dateKey, (salesByDate.get(dateKey) || 0) + sale.amount);
            }
        });

        return Array.from(salesByDate.entries())
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    async getSalesByPlatform(profileId: string): Promise<Array<{ platform: string; amount: number; units: number }>> {
        const sales = await this.salesRepository.getSalesByProfileId(profileId);

        const byPlatform = new Map<string, { amount: number; units: number }>();

        sales.forEach(sale => {
            const current = byPlatform.get(sale.platform) || { amount: 0, units: 0 };
            byPlatform.set(sale.platform, {
                amount: current.amount + sale.amount,
                units: current.units + sale.quantity
            });
        });

        return Array.from(byPlatform.entries()).map(([platform, stats]) => ({
            platform,
            amount: stats.amount,
            units: stats.units
        }));
    }
}
