import { StoryScene } from '@/types/story';

export interface AIService {
    generateStart(prompt: string, genre: string): Promise<StoryScene>;
    generateNextScene(history: StoryScene[], choiceId: string): Promise<StoryScene>;
}
