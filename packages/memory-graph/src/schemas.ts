import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const MemoryGraphSchemaVersion = {
  Node: "stealtheye-memory-node.v1",
  Edge: "stealtheye-memory-edge.v1",
  ProvenanceRef: "stealtheye-memory-provenance-ref.v1",
  GraphBundle: "stealtheye-memory-graph-bundle.v1",
  ContextPacket: "stealtheye-memory-context-packet.v1",
  RetentionReport: "stealtheye-memory-retention-report.v1",
  ReceiptPreview: "stealtheye-memory-graph-receipt-preview.v1"
} as const;

export const MemoryNodeTypeSchema = z.enum(["mission", "task", "agent", "tool", "repo", "branch", "pull_request", "issue", "workflow_run", "file", "receipt_event", "evidence_ref", "build", "decision", "capability", "policy", "gap", "fact", "summary"]);
export const MemoryEdgeTypeSchema = z.enum(["derived_from", "supports", "contradicts", "supersedes", "references", "produced_by", "verified_by", "blocked_by", "depends_on", "belongs_to", "related_to", "summarizes", "observed_in", "governed_by"]);
export const MemorySensitivitySchema = z.enum(["public", "internal_safe", "sensitive_metadata", "secret_forbidden"]);
export const MemoryBoundarySchema = z.enum(["public_safe", "internal_reference", "redacted", "private_reference_placeholder"]);
export const RetentionHintSchema = z.enum(["retain", "review", "redact", "expire", "ephemeral_fixture"]);
export const MemoryStatusSchema = z.enum(["draft", "indexed", "compacted", "stale", "invalid", "redacted"]);
export const ProvenanceSourceTypeSchema = z.enum(["receipt_event", "replay_packet", "repo_status_packet", "generated_build_state", "ADR", "docs_page", "CI_run_summary", "PR_summary", "issue_summary", "fixture"]);
export const DigestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const ConfidenceSchema = z.number().min(0).max(1);

export const PublicSafeMemoryUriSchema = z.string().min(1).refine((uri) => {
  const normalized = uri.toLowerCase();
  return normalized.startsWith("memory://fixture/") || normalized.startsWith("receipt://fixture/") || normalized.startsWith("artifact://fixture/") || normalized.startsWith("docs://") || normalized.startsWith("github://public/") || normalized.startsWith("test://");
}, "Memory Graph refs must use fixture, docs, artifact, test, or github://public URI schemes only in Build 12.");

export const ProvenanceRefSchema = z.object({
  schema_version: z.literal(MemoryGraphSchemaVersion.ProvenanceRef),
  source_id: z.string().min(1),
  source_type: ProvenanceSourceTypeSchema,
  uri: PublicSafeMemoryUriSchema,
  digest: DigestSchema.optional(),
  produced_by: z.string().min(1),
  produced_at: z.string().datetime(),
  public_safe: z.literal(true),
  sensitivity: MemorySensitivitySchema,
  summary: z.string().min(1)
}).refine((ref) => ref.sensitivity !== "secret_forbidden", "Build 12 provenance fixtures must not be secret_forbidden.");

export const MemoryNodeSchema = z.object({
  schema_version: z.literal(MemoryGraphSchemaVersion.Node),
  node_id: z.string().min(1),
  node_type: MemoryNodeTypeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  source_refs: z.array(z.string().min(1)).default([]),
  evidence_refs: z.array(z.string().min(1)).default([]),
  receipt_refs: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  sensitivity: MemorySensitivitySchema,
  public_private_boundary: MemoryBoundarySchema,
  confidence: ConfidenceSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  expires_at: z.string().datetime().optional(),
  retention_hint: RetentionHintSchema,
  attributes: z.record(z.unknown()).default({})
});

export const MemoryEdgeSchema = z.object({
  schema_version: z.literal(MemoryGraphSchemaVersion.Edge),
  edge_id: z.string().min(1),
  from_node_id: z.string().min(1),
  to_node_id: z.string().min(1),
  edge_type: MemoryEdgeTypeSchema,
  summary: z.string().min(1),
  confidence: ConfidenceSchema,
  evidence_refs: z.array(z.string().min(1)).default([]),
  receipt_refs: z.array(z.string().min(1)).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const GraphBundleSchema = z.object({
  graph_id: z.string().min(1),
  schema_version: z.literal(MemoryGraphSchemaVersion.GraphBundle),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  nodes: z.array(MemoryNodeSchema),
  edges: z.array(MemoryEdgeSchema),
  provenance_refs: z.array(ProvenanceRefSchema),
  receipt_refs: z.array(z.string().min(1)).default([]),
  integrity_digest: DigestSchema.optional(),
  public_private_boundary: MemoryBoundarySchema,
  sensitivity: MemorySensitivitySchema,
  status: MemoryStatusSchema
}).superRefine((graph, ctx) => {
  const nodeIds = new Set(graph.nodes.map((node) => node.node_id));
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from_node_id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `edge ${edge.edge_id} missing from_node_id`, path: ["edges"] });
    if (!nodeIds.has(edge.to_node_id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `edge ${edge.edge_id} missing to_node_id`, path: ["edges"] });
  }
});

export const MemoryContextPacketSchema = z.object({ schema_version: z.literal(MemoryGraphSchemaVersion.ContextPacket), graph_id: z.string(), target_node_id: z.string(), nodes: z.array(MemoryNodeSchema), edges: z.array(MemoryEdgeSchema), provenance_refs: z.array(ProvenanceRefSchema), public_safe_summary: z.string() });
export const RetentionReportSchema = z.object({ schema_version: z.literal(MemoryGraphSchemaVersion.RetentionReport), graph_id: z.string(), generated_at: z.string().datetime(), expired_node_ids: z.array(z.string()), redaction_node_ids: z.array(z.string()), secret_forbidden_node_ids: z.array(z.string()), public_safe_summary: z.string() });
export const MemoryGraphReceiptPreviewSchema = z.object({ schema_version: z.literal(MemoryGraphSchemaVersion.ReceiptPreview), preview_id: z.string(), graph_id: z.string(), generated_at: z.string().datetime(), node_count: z.number().int().nonnegative(), edge_count: z.number().int().nonnegative(), receipt_refs: z.array(z.string()), public_safe: z.literal(true), no_durable_storage: z.literal(true), no_embeddings: z.literal(true), summary: z.string() });

export const MemoryNodeJsonSchema = zodToJsonSchema(MemoryNodeSchema, "MemoryNode");
export const MemoryEdgeJsonSchema = zodToJsonSchema(MemoryEdgeSchema, "MemoryEdge");
export const ProvenanceRefJsonSchema = zodToJsonSchema(ProvenanceRefSchema, "ProvenanceRef");
export const GraphBundleJsonSchema = zodToJsonSchema(GraphBundleSchema, "GraphBundle");

export type MemoryNodeType = z.infer<typeof MemoryNodeTypeSchema>;
export type MemoryEdgeType = z.infer<typeof MemoryEdgeTypeSchema>;
export type MemorySensitivity = z.infer<typeof MemorySensitivitySchema>;
export type MemoryBoundary = z.infer<typeof MemoryBoundarySchema>;
export type RetentionHint = z.infer<typeof RetentionHintSchema>;
export type ProvenanceSourceType = z.infer<typeof ProvenanceSourceTypeSchema>;
export type ProvenanceRef = z.infer<typeof ProvenanceRefSchema>;
export type MemoryNode = z.infer<typeof MemoryNodeSchema>;
export type MemoryEdge = z.infer<typeof MemoryEdgeSchema>;
export type GraphBundle = z.infer<typeof GraphBundleSchema>;
export type MemoryContextPacket = z.infer<typeof MemoryContextPacketSchema>;
export type RetentionReport = z.infer<typeof RetentionReportSchema>;
export type MemoryGraphReceiptPreview = z.infer<typeof MemoryGraphReceiptPreviewSchema>;
