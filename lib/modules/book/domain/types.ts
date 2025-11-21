export type BookID = string;

export interface Book {
    id: BookID;
    profileId: string;
    title: string;
    subtitle?: string;
    description?: string;
    format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
    status: 'draft' | 'scheduled' | 'live';
    launchDate?: Date;
    coverPath?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SalesEvent {
    id: string;
    profileId: string;
    platform: 'amazon_kdp' | 'gumroad' | 'smashwords' | 'draft2digital';
    eventType: 'sale' | 'refund';
    quantity: number;
    amount: number;
    currency: string;
    occurredAt: Date;
    rawPayload: any;
}
