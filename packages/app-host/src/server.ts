import { APP_HOST_METADATA } from "./app-metadata";
import { APP_HOST_RESOURCES, readAppHostResource } from "./resources";
import { APP_HOST_TOOL_DESCRIPTORS, handleAppHostTool } from "./tools";
import { AppHostToolNameSchema, type AppHostToolName } from "./tool-schemas";

export interface AppHostServerInfo {
  metadata: typeof APP_HOST_METADATA;
  protocol_direction: "mcp-style-adapter";
  production_ready: false;
  live_write_capability: false;
  tool_count: number;
  resource_count: number;
}

export interface AppHostToolCall {
  name: AppHostToolName | string;
  input?: unknown;
}

export class AppHostServer {
  readonly metadata = APP_HOST_METADATA;
  readonly tools = APP_HOST_TOOL_DESCRIPTORS;
  readonly resources = APP_HOST_RESOURCES;

  info(): AppHostServerInfo {
    return {
      metadata: this.metadata,
      protocol_direction: "mcp-style-adapter",
      production_ready: false,
      live_write_capability: false,
      tool_count: this.tools.length,
      resource_count: this.resources.length
    };
  }

  listTools() {
    return this.tools;
  }

  listResources() {
    return this.resources;
  }

  callTool(call: AppHostToolCall) {
    const name = AppHostToolNameSchema.parse(call.name);
    return handleAppHostTool(name, call.input ?? {});
  }

  readResource(uri: string) {
    return readAppHostResource(uri);
  }
}

export function createAppHostServer(): AppHostServer {
  return new AppHostServer();
}
