import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { services } from '@/lib/services';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth();
        const observations = await services.insights.getObservations(user.id);

        return successResponse(observations);
    } catch (error: any) {
        console.error('GET /api/insights/observations error:', error);
        return errorResponse(error.message || 'Failed to fetch observations', undefined, 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const { observationText, tags } = body;

        if (!observationText) {
            return errorResponse('Observation text is required', undefined, 400);
        }

        const observation = await services.insights.addObservation(user.id, {
            observationText,
            tags,
        });

        return successResponse(observation, undefined, 201);
    } catch (error: any) {
        console.error('POST /api/insights/observations error:', error);
        return errorResponse(error.message || 'Failed to add observation', undefined, 500);
    }
}
