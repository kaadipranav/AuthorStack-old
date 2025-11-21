export type AgentID = string;

export interface AgentPersona {
    id: AgentID;
    name: string;
    role: 'editor' | 'marketer' | 'analyst';
    description: string;
    avatarUrl?: string;
}

export interface Conversation {
    id: string;
    userId: string;
    agentId: AgentID;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
