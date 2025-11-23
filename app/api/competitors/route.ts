import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { services } from '@/lib/services';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth();
        const competitors = await services.competitor.getMyCompetitors(user.id);

        return successResponse(competitors);
    } catch (error: any) {
        console.error('GET /api/competitors error:', error);
        return errorResponse(error.message || 'Failed to fetch competitors', undefined, 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const { asin, title, author, category, format, imageUrl } = body;

        if (!asin || !title) {
            return errorResponse('ASIN and title are required', undefined, 400);
        }

        const competitor = await services.competitor.addCompetitor(user.id, {
            asin,
            title,
            author,
            category,
            format,
            imageUrl,
        });

        return successResponse(competitor, undefined, 201);
    } catch (error: any) {
        console.error('POST /api/competitors error:', error);
        return errorResponse(error.message || 'Failed to add competitor', undefined, 500);
    }
}
