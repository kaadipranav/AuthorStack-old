import { Book, BookID, SalesEvent } from "./types";

export interface BookRepository {
    createBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book>;
    updateBook(id: BookID, book: Partial<Book>): Promise<Book>;
    deleteBook(id: BookID): Promise<void>;
    getBookById(id: BookID): Promise<Book | null>;
    getBooksByProfileId(profileId: string): Promise<Book[]>;
}

export interface SalesRepository {
    recordSale(sale: Omit<SalesEvent, "id">): Promise<void>;
    getSalesByProfileId(profileId: string, range?: { start: Date; end: Date }): Promise<SalesEvent[]>;
}
