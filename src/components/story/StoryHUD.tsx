import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryHUDProps {
    viewIndex: number;
    historyLength: number;
    isSpeaking: boolean;
    onToggleSpeech: () => void;
    onExit: () => void;
}

export function StoryHUD({
    viewIndex,
    historyLength,
    isSpeaking,
    onToggleSpeech,
    onExit,
}: StoryHUDProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-6 pointer-events-none transition-opacity duration-500">
            <div className="pointer-events-auto flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/5 hover:bg-black/40 transition-colors shadow-lg">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold block px-2">
                    SCENE {viewIndex === -1 ? historyLength + 1 : viewIndex + 1}
                </span>
            </div>

            <div className="pointer-events-auto flex gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSpeech}
                    className={cn(
                        "rounded-full bg-black/20 text-white/70 border border-white/5 hover:bg-black/40 hover:text-white transition-all",
                        isSpeaking && "text-indigo-400 animate-pulse"
                    )}
                >
                    {isSpeaking ? (
                        <Volume2 className="w-4 h-4" />
                    ) : (
                        <VolumeX className="w-4 h-4" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    onClick={onExit}
                    className="rounded-full bg-white/10 text-white/80 border border-white/5 hover:bg-red-500/20 hover:text-white transition-all text-xs font-medium uppercase px-4 shadow-lg"
                >
                    Exit
                </Button>
            </div>
        </header>
    );
}
