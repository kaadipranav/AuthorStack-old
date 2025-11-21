import { LaunchChecklist, LaunchTask } from "./types";

export interface LaunchRepository {
    getChecklists(profileId: string): Promise<LaunchChecklist[]>;
    getTasks(profileId: string, limit?: number): Promise<LaunchTask[]>;
}
