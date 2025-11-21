export interface LaunchChecklist {
    id: string;
    profileId: string;
    name: string;
    createdAt: Date;
}

export interface LaunchTask {
    id: string;
    checklistId: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
}
