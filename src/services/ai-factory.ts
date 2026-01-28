import { AIService } from './ai-service.interface';
import { MockAIService } from './mock-ai.service';
import { GroqAIService } from './groq-ai.service';

export function createAIService(): AIService {
    const apiKey = process.env.GROQ_API_KEY;

    if (process.env.USE_MOCK_AI === 'true' || !apiKey) {
        console.log('Using Mock AI Service');
        return new MockAIService();
    }

    return new GroqAIService(apiKey);
}
