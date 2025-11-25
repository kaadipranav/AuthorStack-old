import OpenAI from "openai";
import { env } from "@/lib/env";

/**
 * OpenRouter AI Provider
 * Uses OpenRouter API to access multiple AI models including DeepSeek V3
 * Cost-effective with free tier and pay-as-you-go pricing
 */

export interface AIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AICompletionOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}

export class OpenRouterProvider {
    private client: OpenAI;
    private defaultModel = "deepseek/deepseek-chat"; // DeepSeek V3 - very cost effective

    constructor() {
        if (!env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not configured");
        }

        this.client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
                "X-Title": "AuthorStack",
            },
        });
    }

    /**
     * Generate chat completion
     */
    async chat(
        messages: AIMessage[],
        options: AICompletionOptions = {}
    ): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                model: options.model || this.defaultModel,
                messages: messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 2000,
                stream: false,
            });

            const response = completion.choices[0]?.message?.content || "";
            return response;
        } catch (error) {
            console.error("[OpenRouter] Chat error:", error);
            throw new Error(
                `AI chat failed: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Generate streaming chat completion
     */
    async *chatStream(
        messages: AIMessage[],
        options: AICompletionOptions = {}
    ): AsyncGenerator<string> {
        try {
            const stream = await this.client.chat.completions.create({
                model: options.model || this.defaultModel,
                messages: messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 2000,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    yield content;
                }
            }
        } catch (error) {
            console.error("[OpenRouter] Stream error:", error);
            throw new Error(
                `AI stream failed: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get available models
     */
    getAvailableModels(): string[] {
        return [
            "deepseek/deepseek-chat", // DeepSeek V3 - $0.14/M input, $0.28/M output
            "anthropic/claude-3.5-sonnet", // Claude 3.5 Sonnet
            "openai/gpt-4-turbo", // GPT-4 Turbo
            "google/gemini-pro-1.5", // Gemini Pro 1.5
            "meta-llama/llama-3.1-70b-instruct", // Llama 3.1 70B
        ];
    }

    /**
     * Estimate cost for a completion
     */
    estimateCost(inputTokens: number, outputTokens: number, model?: string): number {
        const pricing: Record<string, { input: number; output: number }> = {
            "deepseek/deepseek-chat": { input: 0.14, output: 0.28 }, // per 1M tokens
            "anthropic/claude-3.5-sonnet": { input: 3.0, output: 15.0 },
            "openai/gpt-4-turbo": { input: 10.0, output: 30.0 },
        };

        const selectedModel = model || this.defaultModel;
        const rates = pricing[selectedModel] || pricing["deepseek/deepseek-chat"];

        const inputCost = (inputTokens / 1_000_000) * rates.input;
        const outputCost = (outputTokens / 1_000_000) * rates.output;

        return inputCost + outputCost;
    }
}

// Singleton instance
let providerInstance: OpenRouterProvider | null = null;

export function getAIProvider(): OpenRouterProvider {
    if (!providerInstance) {
        providerInstance = new OpenRouterProvider();
    }
    return providerInstance;
}
