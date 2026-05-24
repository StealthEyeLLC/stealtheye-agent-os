import { VerificationPacketSchema, ReceiptsReplaySchemaVersion, type VerificationCheck, type VerificationPacket } from "./schemas";

export function createVerificationPacket(input: { verification_packet_id: string; mission_id: string; receipt_bundle_id: string; checks: VerificationCheck[]; ci_run_refs?: string[]; test_refs?: string[]; generated_state_refs?: string[]; policy_checks?: VerificationCheck[]; created_at?: string }): VerificationPacket {
  const failures = [...input.checks, ...(input.policy_checks ?? [])].filter((check) => check.status === "failed").map((check) => check.summary);
  const warnings = [...input.checks, ...(input.policy_checks ?? [])].filter((check) => check.status === "warning").map((check) => check.summary);
  const status = failures.length > 0 ? "failed" : warnings.length > 0 ? "warning" : "passed";
  return VerificationPacketSchema.parse({
    schema_version: ReceiptsReplaySchemaVersion.VerificationPacket,
    verification_packet_id: input.verification_packet_id,
    mission_id: input.mission_id,
    receipt_bundle_id: input.receipt_bundle_id,
    checks: input.checks,
    ci_run_refs: input.ci_run_refs ?? [],
    test_refs: input.test_refs ?? [],
    generated_state_refs: input.generated_state_refs ?? [],
    policy_checks: input.policy_checks ?? [],
    failures,
    warnings,
    status,
    created_at: input.created_at ?? "2026-01-01T00:00:00.000Z"
  });
}
