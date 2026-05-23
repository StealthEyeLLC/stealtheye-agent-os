export type RevocationTargetType = "agent_id" | "manifest_id" | "key_id" | "digest";

export interface RevocationEntry {
  target_type: RevocationTargetType;
  target: string;
  reason: string;
  revoked_at: string;
  evidence_ref?: string;
}

export class RevocationList {
  private readonly entries: RevocationEntry[] = [];

  revoke(entry: Omit<RevocationEntry, "revoked_at"> & { revoked_at?: string }): RevocationEntry {
    const fullEntry: RevocationEntry = { ...entry, revoked_at: entry.revoked_at ?? new Date().toISOString() };
    this.entries.push(fullEntry);
    return fullEntry;
  }

  all(): RevocationEntry[] {
    return [...this.entries];
  }

  isAgentRevoked(agentId: string): boolean {
    return this.has("agent_id", agentId);
  }

  isManifestRevoked(manifestId: string): boolean {
    return this.has("manifest_id", manifestId);
  }

  isKeyRevoked(keyId: string): boolean {
    return this.has("key_id", keyId);
  }

  isDigestRevoked(digest: string): boolean {
    return this.has("digest", digest);
  }

  has(targetType: RevocationTargetType, target: string): boolean {
    return this.entries.some((entry) => entry.target_type === targetType && entry.target === target);
  }
}
