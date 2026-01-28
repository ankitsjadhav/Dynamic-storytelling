import { AIService } from './ai-service.interface';
import { StoryScene } from '@/types/story';
import { v4 as uuidv4 } from 'uuid';

export class MockAIService implements AIService {
    async generateStart(prompt: string, genre: string): Promise<StoryScene> {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return {
            id: uuidv4(),
            title: "The Beginning",
            content: `(Mock) You find yourself in a ${genre} world based on "${prompt}". The air shimmers with possibility.`,
            choices: [
                { id: '1', text: 'Go left towards the dark forest' },
                { id: '2', text: 'Enter the glowing portal' },
            ],
            imageUrl: 'https://fal.media/files/monkey/a7T1.jpg',
        };
    }

    async generateNextScene(history: StoryScene[], choiceId: string): Promise<StoryScene> {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const lastScene = history[history.length - 1];
        const choice = lastScene.choices.find((c) => c.id === choiceId);

        const sceneCount = history.length + 1;
        const isEnding = sceneCount >= 3;

        return {
            id: uuidv4(),
            title: isEnding ? "The End" : `Chapter ${sceneCount}`,
            content: isEnding
                ? `(Mock) The story reaches its conclusion. Your choice to "${choice?.text}" led you here. Fate is sealed.`
                : `(Mock) You chose to "${choice?.text}". The story continues...`,
            choices: isEnding ? [] : [
                { id: '3', text: 'Continue deeper' },
                { id: '4', text: 'Turn back' },
            ],
            isEnding: isEnding,
            imageUrl: 'https://fal.media/files/monkey/a7T1.jpg',
        };
    }
}
