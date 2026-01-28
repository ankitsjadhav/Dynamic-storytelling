import { NextResponse } from 'next/server';
import { createAIService } from '@/services/ai-factory';

export async function POST(req: Request) {
    try {
        const { prompt, genre } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const aiService = createAIService();
        const scene = await aiService.generateStart(prompt, genre || 'fantasy');

        return NextResponse.json(scene);
    } catch (error: any) {
        console.error('API Error Full Details:', error);

        return NextResponse.json(
            { error: 'Failed to start story', details: error.message || error.toString() },
            { status: 500 }
        );
    }
}
