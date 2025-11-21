import { LaunchRepository } from "../domain/repository";
import { LaunchChecklist, LaunchTask } from "../domain/types";

export class LaunchService {
    constructor(private readonly launchRepository: LaunchRepository) { }

    async getMyChecklists(profileId: string): Promise<LaunchChecklist[]> {
        return this.launchRepository.getChecklists(profileId);
    }

    async getUpcomingTasks(profileId: string): Promise<LaunchTask[]> {
        return this.launchRepository.getTasks(profileId);
    }
}
