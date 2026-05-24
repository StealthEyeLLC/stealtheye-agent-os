import { MCP_RUNTIME_ID } from "./fixtures";
import { McpRuntimeSchemaVersion } from "./schemas";
export function createDevModeConnectionInfo(runtime_id = MCP_RUNTIME_ID) {
  return {schema_version:McpRuntimeSchemaVersion.DevModeConnectionInfo,runtime_id,connector_name:"StealthEye Agent OS Dev Runtime",connector_description:"Local/dev preview runtime for safe StealthEye Agent OS planning, policy, registry, guard, and mission previews.",endpoint_path:"/mcp",supported_protocols:["streaming_http","sse"],authentication_modes:["none_for_build_10"],public_distribution:false,production_deployment:false,oauth_credentials_provisioned:false,live_write_tools:false,public_safe:true,required_later_steps:["Wire to an official MCP SDK server or compatible streaming transport.","Expose a reachable development endpoint if ChatGPT developer mode requires one."],notes:["Build 10 does not submit a public app, deploy production infrastructure, provision OAuth credentials, or expose live write tools."]};
}
