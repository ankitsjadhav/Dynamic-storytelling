import { create } from "zustand";
import { StoryScene } from "@/types/story";

interface StoryState {
  currentScene: StoryScene | null;
  history: StoryScene[];
  isLoading: boolean;
  error: string | null;
  viewIndex: number;
  actions: {
    setScene: (scene: StoryScene) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addToHistory: (scene: StoryScene) => void;
    resetStory: () => void;
    goBack: () => void;
    goForward: () => void;
  };
}

export const useStoryStore = create<StoryState>((set, get) => ({
  currentScene: null,
  history: [],
  isLoading: false,
  error: null,
  viewIndex: -1,
  actions: {
    setScene: (scene) => set({ currentScene: scene, viewIndex: -1 }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    addToHistory: (scene) =>
      set((state) => ({ history: [...state.history, scene] })),
    resetStory: () =>
      set({ currentScene: null, history: [], error: null, viewIndex: -1 }),
    goBack: () =>
      set((state) => {
        const maxIndex = state.history.length;
        const currentIndex =
          state.viewIndex === -1 ? maxIndex : state.viewIndex;
        return { viewIndex: Math.max(0, currentIndex - 1) };
      }),
    goForward: () =>
      set((state) => {
        const maxIndex = state.history.length;
        const currentIndex =
          state.viewIndex === -1 ? maxIndex : state.viewIndex;
        const nextIndex = currentIndex + 1;
        return { viewIndex: nextIndex >= maxIndex ? -1 : nextIndex };
      }),
  },
}));

export const useStoryActions = () => useStoryStore((state) => state.actions);
