import { createHash } from "node:crypto";
import { canonicalize } from "./canonicalize";

export function computeDigest(payload: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalize(payload), "utf8").digest("hex")}`;
}
