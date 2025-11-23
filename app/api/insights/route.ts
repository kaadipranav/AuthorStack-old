import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { services } from '@/lib/services';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30');

        const dashboard = await services.insights.getDashboard(user.id, days);

        return successResponse(dashboard);
    } catch (error: any) {
        console.error('GET /api/insights error:', error);
        return errorResponse(error.message || 'Failed to fetch insights', undefined, 500);
    }
}
