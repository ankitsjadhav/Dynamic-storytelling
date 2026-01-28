"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryActions } from "@/store/story-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
  CloudRain,
  Flame,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOOD_LINES = [
  "A forest that remembers names.",
  "A city built on lies.",
  "A child who hears the future.",
  "A love deeper than the ocean.",
  "A secret kept for a thousand years.",
];

const GENRES = [
  { id: "fantasy", label: "Fantasy", icon: "🏰" },
  { id: "scifi", label: "Sci-Fi", icon: "🚀" },
  { id: "mystery", label: "Mystery", icon: "🕵️" },
  { id: "horror", label: "Horror", icon: "👻" },
  { id: "cozy", label: "Cozy", icon: "☕" },
  { id: "random", label: "Surprise Me", icon: "🎲" },
];

const PLACEHOLDERS = [
  "A lonely knight at the edge of the world...",
  "I want a dark mystery with a hopeful ending...",
  "Two rivals forced to work together...",
  "A spaceship drifting into the unknown...",
];

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const { setScene, addToHistory, resetStory } = useStoryActions();

  useEffect(() => {
    const interval = setInterval(() => {
      setMoodIndex((prev) => (prev + 1) % MOOD_LINES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    resetStory();
    setIsLoading(true);
    try {
      const response = await fetch("/api/story/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          genre: genre === "random" ? "" : genre,
        }),
      });

      if (!response.ok) throw new Error("Failed to start story");

      const scene = await response.json();
      setScene(scene);
      router.push("/story");
    } catch (error) {
      console.error(error);
      alert("The ether is quiet (API Error). Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050510] font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r border-white/5 bg-[#0a0a0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0a0f] to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3 text-white/90">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
            <Wand2 className="w-5 h-5" />
          </div>
          <span className="font-serif tracking-wide opacity-80">StorySage</span>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-medium leading-[1.1] tracking-tight text-white mb-8">
            Every thought <br />
            becomes a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              story.
            </span>
          </h1>

          <div className="h-20 relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={moodIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="text-xl font-light text-white/80 font-serif italic"
              >
                "{MOOD_LINES[moodIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Start your journey
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-[#050510] lg:hidden -z-10" />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 lg:hidden">
            <h1 className="text-3xl font-serif text-white mb-2">StorySage</h1>
            <p className="text-white/40 text-sm">
              Every thought becomes a story.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-indigo-200/60 uppercase tracking-widest pl-1">
                  What's on your mind?
                </label>
                <div className="relative group">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[140px] text-lg lg:text-xl bg-black/20 border-white/10 focus:border-indigo-500/50 focus:ring-0 rounded-2xl resize-none p-6 leading-relaxed text-white placeholder:text-transparent transition-all duration-300"
                    required
                  />
                  {!prompt && (
                    <div className="absolute top-6 left-6 right-6 pointer-events-none">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={placeholderIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-lg lg:text-xl text-white font-serif italic"
                        >
                          {PLACEHOLDERS[placeholderIndex]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-indigo-200/60 uppercase tracking-widest pl-1">
                  Pick a Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGenre(g.id)}
                      disabled={isLoading}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                        genre === g.id
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105"
                          : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:border-white/20",
                      )}
                    >
                      <span className="mr-2 opacity-80">{g.icon}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full h-16 bg-white text-black hover:bg-indigo-50 hover:text-indigo-900 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg group relative overflow-hidden"
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 animate-spin text-indigo-600" />
                    <span>Dreaming...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-between w-full px-4">
                    <span>Begin the story</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}

                {isLoading && (
                  <motion.div
                    layoutId="loading"
                    className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
