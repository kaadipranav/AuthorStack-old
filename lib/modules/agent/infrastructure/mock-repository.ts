import { AgentRepository } from "../domain/repository";
import { AgentPersona, Conversation, Message } from "../domain/types";

export class MockAgentRepository implements AgentRepository {
    async getAvailablePersonas(): Promise<AgentPersona[]> {
        return [
            {
                id: "agent-editor",
                name: "Elena (Editor)",
                role: "editor",
                description: "Helps with structure, tone, and grammar.",
            },
            {
                id: "agent-marketer",
                name: "Marcus (Marketer)",
                role: "marketer",
                description: "Strategizes launches and ad campaigns.",
            },
        ];
    }

    async getConversation(id: string): Promise<Conversation | null> {
        return null; // Placeholder
    }

    async createConversation(userId: string, agentId: string): Promise<Conversation> {
        return {
            id: crypto.randomUUID(),
            userId,
            agentId,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async addMessage(conversationId: string, message: Omit<Message, "id" | "timestamp">): Promise<Message> {
        return {
            id: crypto.randomUUID(),
            role: message.role,
            content: message.content,
            timestamp: new Date(),
        };
    }
}
