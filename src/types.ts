/* ===========================
   TYPES
=========================== */

export type ConnectionState =
  | "idle"
  | "connecting"
  | "ready"
  | "closing"
  | "closed"
  | "reconnecting";

export interface RedisOptions {
  host?: string;
  port?: number;
  reconnect?: boolean;
  maxRetries?: number;
  baseDelay?: number;
  maxOfflineQueue?: number;
}

export interface CommandOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export interface PendingCommand {
  cmd: string;
  args: any[];
  resolve: (v: any) => void;
  reject: (e: any) => void;
  timer?: NodeJS.Timeout;
  signal?: AbortSignal;
}
