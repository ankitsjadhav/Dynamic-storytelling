import Groq from "groq-sdk";
import { AIService } from "./ai-service.interface";
import { StoryScene } from "@/types/story";
import { v4 as uuidv4 } from "uuid";

export class GroqAIService implements AIService {
    private client: Groq;

    constructor(apiKey: string) {
        this.client = new Groq({ apiKey });
    }

    private sanitizeContent(text: string): string {
        if (!text) return "";
        return text
            .replace(/undefined/gi, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([a-zA-Z])’([a-zA-Z])/g, "$1'$2")
            .replace(/\s+/g, " ")
            .trim();
    }

    async generateStart(prompt: string, genre: string): Promise<StoryScene> {
        const systemPrompt = `You are a creative interactive storyteller.
Create the opening scene of a ${genre} story based on this prompt: "${prompt}".

### WRITING STYLE (CRITICAL):
- Use simple, modern language.
- Prefer short sentences.
- Avoid rare, academic, or literary words.
- Write like a cinematic screenplay, not a novel.
- One clear image or action per sentence.

### CRITICAL OUTPUT RULES:
1. **Tokenization**: Ensure EVERY word is separated by a whitespace.
2. **Sanitization**: NEVER output the literal string "undefined".
3. **Grammar**: Review spacing carefully. "The ir" is wrong; "Their" is correct.

    ### STRUCTURE RULES:
    • Scene 1: Introduce the world and the conflict.
    • Scene 2: The choice that changes everything.
    • Scene 3: The final confrontation and resolution.

    ### Guidelines:
    1. **Structure**: This story must conclude in exactly 3 scenes. This is Scene 1.
    2. **Length**: Write a complete, immersive scene (approx 200 words). Not too short, not too long.
    3. **Pacing**: Establishing but engaging.
    4. **Foreshadowing**: Drop a subtle hint about a future threat.

Return ONLY a JSON object with this structure:
{
  "title": "A short, dramatic title for this scene",
  "content": "The narrative description...",
  "choices": [
    { "text": "First choice" },
    { "text": "Second choice" }
  ],
  "visualPrompt": "Detailed visual description (no text)"
}`;

        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "user", content: systemPrompt },
                ],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const text = completion.choices[0]?.message?.content;
            if (!text) throw new Error("Received empty response from Groq.");

            const data = JSON.parse(text);

            return {
                id: uuidv4(),
                title: data.title || "The Adventure Begins",
                content: this.sanitizeContent(data.content),
                visualPrompt: data.visualPrompt,
                choices: data.choices.map((c: { text: string }, i: number) => ({
                    id: i.toString(),
                    text: c.text,
                })),
            };
        } catch (error) {
            console.error("Groq Error:", error);
            throw new Error("Failed to generate story start.");
        }
    }

    async generateNextScene(
        history: StoryScene[],
        choiceId: string,
        timeTaken?: number,
    ): Promise<StoryScene> {
        const previousContext = history.map((h) => h.content).join("\n---\n");
        const lastScene = history[history.length - 1];

        const selectedChoice = lastScene.choices.find((c) => c.id === choiceId);
        const choice = selectedChoice ? selectedChoice.text : choiceId;

        let timingContext = "";
        if (timeTaken) {
            if (timeTaken < 3)
                timingContext = "User chose IMMEDIATELY (Impulsive, rash, confident).";
            else if (timeTaken > 8)
                timingContext =
                    "User HESITATED for a long time (Fearful, thoughtful, or uncertain).";
        }

        const sceneCount = history.length + 1;

        const systemPrompt = `Continue this story.

### WRITING STYLE (CRITICAL):
- Use simple, modern language.
- Prefer short sentences.
- Avoid rare, academic, or literary words.
- Write like a cinematic screenplay, not a novel.
- One clear image or action per sentence.

      ### STRUCTURE RULES:
      • Scene 1: Introduce the world and the conflict.
      • Scene 2: The choice that changes everything.
      • Scene 3: The final confrontation and resolution.

      ### Pacing & Structure:
      - **Current Progress**: Scene ${sceneCount} of 3.
      - **Ending Logic**:
        ${sceneCount >= 3
                ? `THIS IS THE FINAL SCENE. You MUST wrap up the story now.
                   - "isEnding": true
                   - "choices": [] (An empty array)
                   - "content": Write a dramatic, satisfying conclusion.
                   - End with a clear final beat or realization.
                   - The last sentence must change how the reader sees the story.
                   - Do NOT end mid-action. This is the conclusion.`
                : `The story continues.
                   - "isEnding": false
                   - "choices": Provide 2 interesting options.`
            }

### CRITICAL OUTPUT RULES:
1. **Spacing**: Check that no words are merged. "The y" is wrong; "They" is correct.
2. **Output**: STRICTLY prevent the word "undefined" from appearing.
3. **Timing**: ${timingContext} Reflect this in narrative.

Previous Context:
${previousContext}

User Action/Thought: "${choice}"

Return ONLY a JSON object with:
{
  "title": "Dramatic title",
  "content": "Narrative...",
  "choices": [ { "text": "Option 1" }, { "text": "Option 2" } ],
  "isEnding": boolean,
  "visualPrompt": "Visual description"
}`;

        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "user", content: systemPrompt },
                ],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const text = completion.choices[0]?.message?.content;
            if (!text) throw new Error("Received empty response from Groq.");

            const data = JSON.parse(text);

            const shouldForceEnd = sceneCount >= 3;
            const isEnding = shouldForceEnd || data.isEnding || false;

            return {
                id: uuidv4(),
                title: data.title || "The Next Chapter",
                content: this.sanitizeContent(data.content),
                visualPrompt: data.visualPrompt,
                choices: isEnding
                    ? []
                    : data.choices.map((c: { text: string }, i: number) => ({
                        id: i.toString(),
                        text: c.text,
                    })),
                isEnding: isEnding,
            };
        } catch (error) {
            console.error("Groq next scene error", error);
            throw new Error("Failed to continue story");
        }
    }
}
