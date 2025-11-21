import { AgentPersona, Conversation, Message } from "./types";

export interface AgentRepository {
    getAvailablePersonas(): Promise<AgentPersona[]>;
    getConversation(id: string): Promise<Conversation | null>;
    createConversation(userId: string, agentId: string): Promise<Conversation>;
    addMessage(conversationId: string, message: Omit<Message, "id" | "timestamp">): Promise<Message>;
}
