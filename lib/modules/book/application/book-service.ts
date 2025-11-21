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
}
