import type { RecordEntity } from "@/types";

// Type guard to check if records.value has a 'members' property
export const hasMembers = (data: unknown): data is { members: RecordEntity[] } =>
    typeof data === 'object' && data !== null && Array.isArray((data as any).members);
