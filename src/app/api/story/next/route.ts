import { NextResponse } from 'next/server';
import { createAIService } from '@/services/ai-factory';

export async function POST(req: Request) {
    try {
        const { history, choiceId } = await req.json();

        if (!history || !choiceId) {
            return NextResponse.json({ error: 'History and choiceId are required' }, { status: 400 });
        }

        const aiService = createAIService();
        const scene = await aiService.generateNextScene(history, choiceId);

        return NextResponse.json(scene);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to generate next scene' }, { status: 500 });
    }
}
