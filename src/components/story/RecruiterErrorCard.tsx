import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, Terminal, RefreshCw, Home } from "lucide-react";

export function RecruiterErrorCard({
    onRetry,
    onHome,
}: {
    onRetry: () => void;
    onHome: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden"
        >
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wide">
                            Story Generation Failed
                        </h3>
                        <p className="text-xs text-gray-500">
                            The narrative engine encountered an interruption.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                <p className="text-sm text-gray-600 leading-relaxed">
                    Unable to reach the Gemini API. This is likely due to a network
                    timeout or temporary service unavailability. Your story progress has
                    been saved.
                </p>

                {showDetails && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                            <Terminal className="w-3 h-3" />
                            <span>DEBUG_LOG</span>
                        </div>
                        <p className="text-xs font-mono text-gray-600">
                            Error: 504_GATEWAY_TIMEOUT
                        </p>
                        <p className="text-xs font-mono text-gray-600">
                            Provider: Google.GenerativeAI
                        </p>
                        <p className="text-xs font-mono text-gray-600">
                            Endpoint: POST /v1beta/models/gemini-2.5-flash:generateContent
                        </p>
                    </div>
                )}

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
                >
                    {showDetails ? "Hide technical details" : "Show technical details"}
                </button>
            </div>

            <div className="bg-gray-50 p-4 flex gap-3">
                <Button
                    onClick={onRetry}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Request
                </Button>
                <Button
                    variant="outline"
                    onClick={onHome}
                    className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border-gray-200"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                </Button>
            </div>
        </motion.div>
    );
}
