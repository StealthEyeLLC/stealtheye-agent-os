import { RetryPolicySchema, RetryStateSchema, WorkerFleetSchemaVersion, type RetryPolicy, type RetryState } from "./schemas";

export const defaultRetryPolicy: RetryPolicy = RetryPolicySchema.parse({
  schema_version: WorkerFleetSchemaVersion.RetryPolicy,
  max_attempts: 3,
  backoff_strategy: "exponential",
  base_delay_ms: 1000,
  max_delay_ms: 60_000,
  jitter: false,
  retryable_reason_codes: ["temporary_failure", "ci_flake", "rate_limited", "worker_lost"],
  non_retryable_reason_codes: ["guard_denied", "hard_stop", "invalid_request", "idempotency_collision"]
});

export function createRetryState(policy: RetryPolicy, currentAttempt = 0): RetryState {
  return RetryStateSchema.parse({
    schema_version: WorkerFleetSchemaVersion.RetryState,
    max_attempts: policy.max_attempts,
    current_attempt: currentAttempt,
    backoff_strategy: policy.backoff_strategy,
    base_delay_ms: policy.base_delay_ms,
    max_delay_ms: policy.max_delay_ms,
    jitter: policy.jitter,
    retryable_reason_codes: policy.retryable_reason_codes,
    non_retryable_reason_codes: policy.non_retryable_reason_codes,
    exhausted: currentAttempt >= policy.max_attempts
  });
}

export function retryDelayMs(state: RetryState, attempt = state.current_attempt + 1): number {
  const multiplier = state.backoff_strategy === "fixed"
    ? 1
    : state.backoff_strategy === "linear"
      ? Math.max(1, attempt)
      : 2 ** Math.max(0, attempt - 1);
  return Math.min(state.max_delay_ms, state.base_delay_ms * multiplier);
}

export function isRetryableReason(state: RetryState, reasonCode: string): boolean {
  if (state.non_retryable_reason_codes.includes(reasonCode)) return false;
  if (state.retryable_reason_codes.length === 0) return true;
  return state.retryable_reason_codes.includes(reasonCode);
}

export function scheduleRetry(state: RetryState, reasonCode: string, now: Date): RetryState {
  const nextAttempt = state.current_attempt + 1;
  const exhausted = nextAttempt >= state.max_attempts || !isRetryableReason(state, reasonCode);
  const base = {
    ...state,
    current_attempt: nextAttempt,
    exhausted
  };
  if (exhausted) return RetryStateSchema.parse(base);
  return RetryStateSchema.parse({
    ...base,
    next_retry_at: new Date(now.getTime() + retryDelayMs(state, nextAttempt)).toISOString()
  });
}

export function hasRetriesRemaining(state: RetryState): boolean {
  return !state.exhausted && state.current_attempt < state.max_attempts;
}
