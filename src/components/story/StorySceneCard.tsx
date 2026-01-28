import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Scroll,
    BrainCircuit,
    Footprints,
    MapPin,
    Sword,
    Moon,
    Sun,
    CloudRain,
    Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TypewriterEffect } from "@/components/story/TypewriterEffect";
import { StoryScene } from "@/types/story";

interface StorySceneCardProps {
    scene: StoryScene;
    isViewingHistory: boolean;
    isLoading: boolean;
    shouldStream: boolean;
    onStreamComplete: () => void;
    onChoice: (choiceId: string, customText?: string) => void;
    onRestart: () => void;
}

export function StorySceneCard({
    scene,
    isViewingHistory,
    isLoading,
    shouldStream,
    onStreamComplete,
    onChoice,
    onRestart,
}: StorySceneCardProps) {
    const [interactionMode, setInteractionMode] = useState<"cards" | "thought">(
        "cards",
    );
    const [thoughtInput, setThoughtInput] = useState("");

    const getThemeIcon = () => {
        if (!scene?.title) return Moon;
        const icons = [Moon, Sun, CloudRain, Flame, Sword, MapPin];
        return icons[scene.title.length % icons.length];
    };
    const ThemeIcon = getThemeIcon();

    const submitThought = (e: React.FormEvent) => {
        e.preventDefault();
        if (!thoughtInput.trim()) return;
        onChoice("custom", thoughtInput);
        setThoughtInput("");
    };

    return (
        <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[800px] bg-[rgba(255,255,255,0.94)] backdrop-blur-sm rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
            <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-3 flex flex-col px-1 pb-6 border-b border-gray-200/60">
                    <div className="flex items-center gap-3 text-indigo-900/40">
                        <ThemeIcon className="w-5 h-5" />
                        <h2 className="text-xs font-bold tracking-[0.3em] uppercase">
                            {scene.title || "Interactive Scene"}
                        </h2>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none font-serif leading-[1.8] text-gray-800">
                    <TypewriterEffect
                        text={scene.content}
                        speed={15}
                        shouldAnimate={shouldStream}
                        onComplete={onStreamComplete}
                    />
                </div>

                <div className="pt-8 space-y-6">
                    {scene.isEnding ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                            className="text-center space-y-8 py-8 border-t border-gray-100"
                        >
                            <div className="space-y-4">
                                <p className="text-3xl font-serif text-gray-800 italic">
                                    The End
                                </p>
                                <div className="w-12 h-1 bg-gradient-to-r from-indigo-300 to-purple-300 mx-auto rounded-full" />
                            </div>

                            <Button
                                onClick={onRestart}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-indigo-200 transition-all hover:scale-105"
                            >
                                Start a New Story
                            </Button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Your Action
                                </p>
                                <div className="flex bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => setInteractionMode("cards")}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            interactionMode === "cards"
                                                ? "bg-white shadow-sm text-indigo-600"
                                                : "text-gray-400 hover:text-gray-600",
                                        )}
                                    >
                                        <Scroll className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setInteractionMode("thought")}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            interactionMode === "thought"
                                                ? "bg-white shadow-sm text-indigo-600"
                                                : "text-gray-400 hover:text-gray-600",
                                        )}
                                    >
                                        <BrainCircuit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {interactionMode === "cards" ? (
                                <div className="grid gap-4">
                                    {scene.choices.map((choice, index) => {
                                        const Icon =
                                            index % 2 === 0
                                                ? Footprints
                                                : index % 3 === 0
                                                    ? MapPin
                                                    : Sword;
                                        return (
                                            <motion.button
                                                key={choice.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                onClick={() => onChoice(choice.id)}
                                                disabled={isLoading || isViewingHistory}
                                                className={`group relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-5
                          ${isViewingHistory
                                                        ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100"
                                                        : "bg-white border-gray-100 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-md hover:-translate-y-0.5"
                                                    }
                          `}
                                            >
                                                <div
                                                    className={`p-3 rounded-full bg-gray-50 group-hover:bg-white group-hover:text-indigo-500 transition-colors text-gray-400`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-base font-semibold text-gray-800 block group-hover:text-indigo-900 transition-colors font-sans">
                                                        {choice.text}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                                                        {index === 0 ? "A bold choice" : "Use caution"}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onSubmit={submitThought}
                                    className="space-y-4"
                                >
                                    <Input
                                        value={thoughtInput}
                                        onChange={(e) => setThoughtInput(e.target.value)}
                                        placeholder="Describe exactly what you do..."
                                        disabled={isLoading || isViewingHistory}
                                        className="bg-gray-50 border-gray-200 text-gray-800 min-h-[60px] text-lg pl-4 rounded-xl focus:ring-indigo-100 focus:border-indigo-300 shadow-inner placeholder:text-gray-400"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!thoughtInput.trim() || isLoading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold shadow-lg shadow-indigo-200"
                                    >
                                        Commit Action
                                    </Button>
                                </motion.form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
