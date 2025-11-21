import { AgentRepository } from "../domain/repository";
import { AgentPersona, Conversation, Message } from "../domain/types";

export class AgentService {
    constructor(private readonly agentRepository: AgentRepository) { }

    async getPersonas(): Promise<AgentPersona[]> {
        return this.agentRepository.getAvailablePersonas();
    }

    async startChat(userId: string, agentId: string): Promise<Conversation> {
        return this.agentRepository.createConversation(userId, agentId);
    }

    async sendMessage(conversationId: string, content: string): Promise<Message> {
        // 1. Save user message
        await this.agentRepository.addMessage(conversationId, { role: "user", content });

        // 2. Trigger AI response (placeholder)
        // In a real implementation, this would call an LLM service
        const response = await this.agentRepository.addMessage(conversationId, {
            role: "assistant",
            content: "I'm a placeholder agent. I can't think yet!"
        });

        return response;
    }
}
