"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useStoryStore, useStoryActions } from "@/store/story-store";
import { RecruiterErrorCard } from "@/components/story/RecruiterErrorCard";
import { CinematicBackground } from "@/components/story/CinematicBackground";
import { StoryHUD } from "@/components/story/StoryHUD";
import { StoryNavigation } from "@/components/story/StoryNavigation";
import { CinematicTitleOverlay } from "@/components/story/CinematicTitleOverlay";
import { StorySceneCard } from "@/components/story/StorySceneCard";
import { StoryLoadingOverlay } from "@/components/story/StoryLoadingOverlay";

export default function StoryPage() {
    const router = useRouter();
    const { currentScene, history, isLoading, viewIndex } = useStoryStore();
    const { setScene, addToHistory, setLoading, goBack, goForward } =
        useStoryActions();

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showTitleCard, setShowTitleCard] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [errorState, setErrorState] = useState(false);

    const revealedScenes = useRef<Set<string>>(new Set());
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (!currentScene) {
            router.push("/");
        }
    }, [currentScene, router]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }
        return () => {
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const displayedScene =
        viewIndex === -1 ? currentScene : history[viewIndex] || currentScene;
    const isViewingHistory = viewIndex !== -1 && viewIndex < history.length;

    const toggleSpeech = () => {
        if (!displayedScene || !synthRef.current) return;

        if (isSpeaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(displayedScene.content);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
            setIsSpeaking(true);
        }
    };

    useEffect(() => {
        if (currentScene) {
            setShowTitleCard(true);
            setStartTime(Date.now());
            setErrorState(false);

            const timer = setTimeout(() => {
                setShowTitleCard(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [currentScene?.id]);

    const shouldStream =
        !!displayedScene &&
        !isViewingHistory &&
        !revealedScenes.current.has(displayedScene.id);

    const handleStreamComplete = () => {
        if (displayedScene) {
            revealedScenes.current.add(displayedScene.id);
        }
    };

    const handleChoice = async (choiceId: string, customText?: string) => {
        if (isLoading || isTransitioning || isViewingHistory) return;

        const timeTaken = Math.round((Date.now() - startTime) / 1000);

        if (synthRef.current) synthRef.current.cancel();
        setIsSpeaking(false);
        setIsTransitioning(true);
        setLoading(true);
        setErrorState(false);

        try {
            const response = await fetch("/api/story/next", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: [...history, currentScene],
                    choiceId: customText || choiceId,
                    timeTaken,
                }),
            });

            if (!response.ok) throw new Error("Failed to next scene");
            const nextScene = await response.json();

            await new Promise((resolve) => setTimeout(resolve, 800));

            if (currentScene) addToHistory(currentScene);
            setScene(nextScene);
        } catch (error) {
            console.error(error);
            setErrorState(true);
        } finally {
            setLoading(false);
            setIsTransitioning(false);
        }
    };

    if (!displayedScene) return null;

    return (
        <div className="flex flex-col min-h-screen font-sans overflow-hidden relative selection:bg-indigo-500/20">
            <CinematicBackground />

            <StoryHUD
                viewIndex={viewIndex}
                historyLength={history.length}
                isSpeaking={isSpeaking}
                onToggleSpeech={toggleSpeech}
                onExit={() => router.push("/")}
            />

            <StoryNavigation
                onBack={goBack}
                onForward={goForward}
                viewIndex={viewIndex}
                historyLength={history.length}
            />

            <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-4 md:p-8 w-full max-w-none">
                <CinematicTitleOverlay
                    isVisible={
                        showTitleCard && !isViewingHistory && !isLoading && !errorState
                    }
                    title={displayedScene.title || "Chapter " + (history.length + 1)}
                />

                {errorState ? (
                    <RecruiterErrorCard
                        onRetry={() => setErrorState(false)}
                        onHome={() => router.push("/")}
                    />
                ) : (
                    <AnimatePresence mode="wait">
                        {!isTransitioning && !showTitleCard && (
                            <StorySceneCard
                                scene={displayedScene}
                                isViewingHistory={isViewingHistory}
                                isLoading={isLoading}
                                shouldStream={shouldStream}
                                onStreamComplete={handleStreamComplete}
                                onChoice={handleChoice}
                                onRestart={() => router.push("/")}
                            />
                        )}
                    </AnimatePresence>
                )}

                <StoryLoadingOverlay
                    isVisible={
                        (isLoading || isTransitioning) && !showTitleCard && !errorState
                    }
                />
            </main>
        </div>
    );
}
