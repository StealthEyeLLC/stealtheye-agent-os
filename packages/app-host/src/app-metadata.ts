export const APP_HOST_NAME = "StealthEye Agent OS App Host Shell";
export const APP_HOST_VERSION = "0.1.0";
export const APP_HOST_BUILD_STAGE = "Build 5: ChatGPT App / MCP Server Host Shell foundation";

export const APP_HOST_PUBLIC_PRIVATE_BOUNDARY = {
  public: [
    "non-secret schemas",
    "preview-only tool descriptors",
    "fixture-backed validation",
    "policy summaries",
    "public-safe eval fixtures"
  ],
  private: [
    "secrets and credentials",
    "production endpoints",
    "customer data",
    "private OAuth clients",
    "real cloud or account identifiers",
    "sensitive operational runbooks",
    "production capability issuance"
  ]
};

export const APP_HOST_LIMITATIONS = [
  "foundation shell only",
  "not a production ChatGPT app",
  "not a live MCP deployment",
  "no live repository mutation",
  "no worker execution",
  "no browser automation",
  "no deployment capability",
  "no secret access",
  "no money movement",
  "no customer-data workflows",
  "no certification claim"
];

export const SUPPORTED_TOOL_FAMILIES = ["host", "mission", "guard", "registry", "policy"];

export const APP_HOST_METADATA = {
  name: APP_HOST_NAME,
  version: APP_HOST_VERSION,
  build_stage: APP_HOST_BUILD_STAGE,
  supported_tool_families: SUPPORTED_TOOL_FAMILIES,
  public_private_boundary: APP_HOST_PUBLIC_PRIVATE_BOUNDARY,
  limitations: APP_HOST_LIMITATIONS,
  next_planned_build: "Build 6: Worker Fleet",
  production_ready: false,
  certification_claim: false,
  live_write_capability: false
} as const;

export const APP_HOST_BOUNDARIES = [
  "All Build 5 tools are read-only, fixture-only, or preview-only.",
  "No tool performs live repo mutation, branch creation, commits, PR creation, CI reruns, browser actions, deployments, deletion, secret access, money movement, external sends, or customer-data access.",
  "Registry tools validate and preview fixture-backed trust; they do not fetch remote manifests or trust remote descriptions blindly.",
  "Guard tools preview decisions and receipts; they never execute requested actions.",
  "Mission tools validate, compile, and preview Mission Language; they do not run workers."
];
