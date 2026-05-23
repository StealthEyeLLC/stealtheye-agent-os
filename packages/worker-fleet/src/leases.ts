import { WorkerFleetSchemaVersion, WorkerLeaseSchema, type WorkerLease } from "./schemas";

export interface CreateLeaseInput {
  task_id: string;
  worker_id: string;
  now: Date;
  ttl_ms: number;
  attempt?: number;
  evidence_refs?: string[];
}

export function createLease(input: CreateLeaseInput): WorkerLease {
  return WorkerLeaseSchema.parse({
    schema_version: WorkerFleetSchemaVersion.WorkerLease,
    lease_id: `lease:${input.task_id}:${input.worker_id}:${input.now.getTime()}`,
    task_id: input.task_id,
    worker_id: input.worker_id,
    acquired_at: input.now.toISOString(),
    expires_at: new Date(input.now.getTime() + input.ttl_ms).toISOString(),
    heartbeat_at: input.now.toISOString(),
    lease_status: "active",
    attempt: input.attempt ?? 1,
    fencing_token: 1,
    evidence_refs: input.evidence_refs ?? []
  });
}

export function isLeaseExpired(lease: WorkerLease, now: Date): boolean {
  return lease.lease_status === "expired" || new Date(lease.expires_at).getTime() <= now.getTime();
}

export function isLeaseActive(lease: WorkerLease, now: Date): boolean {
  return lease.lease_status === "active" && !isLeaseExpired(lease, now);
}

function assertCurrentLease(lease: WorkerLease, fencingToken: number, now: Date): void {
  if (!isLeaseActive(lease, now)) throw new Error(`lease is not active: ${lease.lease_id}`);
  if (fencingToken !== lease.fencing_token) throw new Error(`stale fenced lease update rejected: ${lease.lease_id}`);
}

export function heartbeatLease(lease: WorkerLease, now: Date, ttlMs: number, fencingToken = lease.fencing_token): WorkerLease {
  assertCurrentLease(lease, fencingToken, now);
  return WorkerLeaseSchema.parse({
    ...lease,
    heartbeat_at: now.toISOString(),
    expires_at: new Date(now.getTime() + ttlMs).toISOString(),
    fencing_token: lease.fencing_token + 1
  });
}

export function releaseLease(lease: WorkerLease, now: Date, fencingToken = lease.fencing_token): WorkerLease {
  assertCurrentLease(lease, fencingToken, now);
  return WorkerLeaseSchema.parse({
    ...lease,
    heartbeat_at: now.toISOString(),
    lease_status: "released",
    fencing_token: lease.fencing_token + 1
  });
}

export function completeLease(lease: WorkerLease, now: Date, fencingToken = lease.fencing_token): WorkerLease {
  assertCurrentLease(lease, fencingToken, now);
  return WorkerLeaseSchema.parse({
    ...lease,
    heartbeat_at: now.toISOString(),
    lease_status: "completed",
    fencing_token: lease.fencing_token + 1
  });
}

export function expireLease(lease: WorkerLease, now: Date): WorkerLease {
  if (!isLeaseExpired(lease, now)) return lease;
  return WorkerLeaseSchema.parse({ ...lease, lease_status: "expired" });
}
