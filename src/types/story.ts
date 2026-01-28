export interface Choice {
  id: string;
  text: string;
  nextSceneId?: string;
}

export interface StoryScene {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
  imageUrl?: string;
  visualPrompt?: string;
  isEnding?: boolean;
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  scenes: StoryScene[];
  createdAt: Date;
}

export interface CreateStoryRequest {
  prompt: string;
  genre?: string;
}
