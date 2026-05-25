import { listRuntimeTools, type RuntimeToolDescriptor } from "@stealtheye/mcp-runtime";
import { McpServerSchemaVersion, McpServerToolDescriptorSchema, type McpServerToolDescriptor } from "./schemas";

function sourcePackageFor(tool: RuntimeToolDescriptor): string {
  if (tool.app_host_tool) return "@stealtheye/app-host";
  if (tool.repo_status_tool) return "@stealtheye/repo-status";
  if (tool.memory_graph_tool) return "@stealtheye/memory-graph";
  if (tool.codeops_write_tool) return "@stealtheye/codeops";
  return "@stealtheye/mcp-runtime";
}

export function toServerToolDescriptor(tool: RuntimeToolDescriptor): McpServerToolDescriptor {
  return McpServerToolDescriptorSchema.parse({
    schema_version: McpServerSchemaVersion.ToolDescriptor,
    name: tool.name,
    title: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    outputSchema: tool.outputSchema,
    annotations: tool.annotations,
    safety: {
      readOnly: tool.safety.readOnly,
      previewOnly: tool.safety.previewOnly,
      fixtureOnly: tool.safety.fixtureOnly,
      destructive: false,
      live: tool.safety.live,
      liveWrite: false,
      unrestrictedLiveWrite: false,
      externalSideEffect: false,
      productionMutation: false,
      protectedBranchMutation: false,
      secretAccess: false,
      customerData: false,
      moneyMovement: false,
      liveCapabilityStatus: tool.safety.liveCapabilityStatus,
      allowedEffects: tool.safety.allowedEffects,
      hardStopCategories: tool.safety.hardStopCategories,
      receiptExpectations: tool.safety.receiptExpectations,
      evidenceExpectations: tool.safety.evidenceExpectations
    },
    sourcePackage: sourcePackageFor(tool),
    officialMcpAligned: true,
    sdkAdapterBoundary: true
  });
}

export function assertServerToolDescriptorSafe(tool: McpServerToolDescriptor): boolean {
  const safe = tool.safety.destructive === false &&
    tool.safety.liveWrite === false &&
    tool.safety.unrestrictedLiveWrite === false &&
    tool.safety.externalSideEffect === false &&
    tool.safety.productionMutation === false &&
    tool.safety.protectedBranchMutation === false &&
    tool.safety.secretAccess === false &&
    tool.safety.customerData === false &&
    tool.safety.moneyMovement === false &&
    tool.annotations.destructiveHint === false &&
    tool.annotations.openWorldHint === false;
  if (!safe) throw new Error(`Unsafe MCP server tool descriptor rejected: ${tool.name}`);
  const allowedReadOrFixture = tool.safety.readOnly || tool.safety.fixtureOnly;
  if (!allowedReadOrFixture) throw new Error(`Unrestricted non-read-only tool rejected: ${tool.name}`);
  return true;
}

export function assertNoDuplicateToolNames(tools: McpServerToolDescriptor[]): boolean {
  const names = new Set<string>();
  for (const tool of tools) {
    if (names.has(tool.name)) throw new Error(`Duplicate MCP server tool name rejected: ${tool.name}`);
    names.add(tool.name);
  }
  return true;
}

export function createToolRegistry(runtimeTools: RuntimeToolDescriptor[] = listRuntimeTools()) {
  const tools = runtimeTools.map(toServerToolDescriptor);
  assertNoDuplicateToolNames(tools);
  tools.forEach(assertServerToolDescriptorSafe);
  return tools;
}

export function createSafetyInventory(tools = createToolRegistry()) {
  return {
    schema_version: McpServerSchemaVersion.SafetyInventory,
    tool_count: tools.length,
    read_only_tools: tools.filter((tool) => tool.safety.readOnly).map((tool) => tool.name),
    preview_only_tools: tools.filter((tool) => tool.safety.previewOnly).map((tool) => tool.name),
    fixture_only_tools: tools.filter((tool) => tool.safety.fixtureOnly).map((tool) => tool.name),
    read_only_live_tools: tools.filter((tool) => tool.safety.liveCapabilityStatus === "read_only_live").map((tool) => tool.name),
    unrestricted_live_write_tools: [],
    destructive_tools: [],
    production_mutation_tools: [],
    protected_branch_mutation_tools: [],
    secret_access_tools: [],
    customer_data_tools: [],
    money_movement_tools: [],
    safety_truth_preserved: true
  };
}
