import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { services } from '@/lib/services';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const { competitorId } = body;

        if (!competitorId) {
            return errorResponse('Competitor ID is required', undefined, 400);
        }

        // Verify ownership
        const competitor = await services.competitor.getCompetitorDetails(competitorId);
        if (!competitor || competitor.profileId !== user.id) {
            return errorResponse('Unauthorized', undefined, 403);
        }

        await services.competitor.syncCompetitor(competitorId);

        return successResponse({ message: 'Sync triggered successfully' });
    } catch (error: any) {
        console.error('POST /api/competitors/sync error:', error);
        return errorResponse(error.message || 'Failed to trigger sync', undefined, 500);
    }
}
