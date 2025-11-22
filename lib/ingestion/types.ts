export type IngestionJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
export type IngestionPlatform = 'amazon_kdp' | 'gumroad' | 'smashwords' | 'draft2digital' | 'payhip' | 'lulu';

export interface IngestionJob {
  id: string;
  profile_id: string;
  platform: IngestionPlatform;
  status: IngestionJobStatus;
  payload: Record<string, unknown>;
  scheduled_for: string;
  executed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface IngestionAttempt {
  id: string;
  job_id: string;
  attempt_number: number;
  status: IngestionJobStatus;
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
}

export interface CronLog {
  id: string;
  job_name: string;
  status: 'started' | 'completed' | 'failed';
  payload: Record<string, unknown>;
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
}

export interface IngestionResult {
  success: boolean;
  jobId: string;
  message: string;
  salesEventsCreated?: number;
  error?: string;
}

export interface PlatformIngestionHandler {
  platform: IngestionPlatform;
  handle(job: IngestionJob): Promise<IngestionResult>;
}
