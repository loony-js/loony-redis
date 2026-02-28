import net from "net";
import { encodeCommand } from "./encoder";
import { RESPParser } from "./parser";
import {
  ConnectionState,
  RedisOptions,
  PendingCommand,
  CommandOptions,
} from "./types";

export default class RedisClient {
  private host: string;
  private port: number;
  private socket: net.Socket | null = null;
  private parser = new RESPParser();

  // private connected = false;
  private state: ConnectionState = "idle";
  private connectPromise: Promise<void> | null = null;
  private reconnectEnabled: boolean;
  private retryCount = 0;
  private maxRetries: number;
  private baseDelay: number;
  private manualClose = false;
  private pending: PendingCommand[] = [];
  private offlineQueue: PendingCommand[] = [];
  private maxOfflineQueue: number;

  constructor({
    host = "127.0.0.1",
    port = 6379,
    reconnect = true,
    maxRetries = Infinity,
    baseDelay = 100,
    maxOfflineQueue = 1000,
  }: RedisOptions = {}) {
    this.host = host;
    this.port = port;
    this.reconnectEnabled = reconnect;
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxOfflineQueue = maxOfflineQueue;
  }

  getState() {
    return this.state;
  }

  private setState(next: ConnectionState) {
    const prev = this.state;

    const validTransitions: Record<ConnectionState, ConnectionState[]> = {
      idle: ["connecting"],
      connecting: ["ready", "closed"],
      ready: ["closing", "reconnecting", "closed"],
      reconnecting: ["ready", "closed"],
      closing: ["closed"],
      closed: ["connecting"],
    };

    if (!validTransitions[prev].includes(next)) {
      throw new Error(`Invalid state transition: ${prev} → ${next}`);
    }

    this.state = next;

    if (next === "ready") {
      this.flushOfflineQueue();
    }
  }

  async connect(): Promise<void> {
    if (this.state === "ready") return;
    if (this.state === "connecting") return this.connectPromise!;
    if (this.state !== "idle" && this.state !== "closed") {
      throw new Error(`Cannot connect in state: ${this.state}`);
    }

    this.manualClose = false;
    this.setState("connecting");

    this.connectPromise = new Promise((resolve, reject) => {
      this.socket = net.createConnection(
        { host: this.host, port: this.port },
        () => {
          this.retryCount = 0;
          this.setState("ready");
          resolve();
        },
      );

      this.socket.on("data", (chunk: Buffer) => {
        const responses = this.parser.push(chunk);

        for (const res of responses) {
          const request = this.pending.shift();
          if (!request) continue;

          if (res instanceof Error) request.reject(res);
          else request.resolve(res);
        }
      });

      this.socket.on("error", () => {
        // error handled by close
      });

      this.socket.on("close", () => {
        if (this.manualClose) {
          this.cleanup(new Error("Connection closed"));
          return;
        }

        if (!this.reconnectEnabled) {
          this.cleanup(new Error("Connection lost"));
          return;
        }

        this.handleReconnect();
      });
    });

    return this.connectPromise;
  }

  private cleanup(error: Error) {
    if (this.state === "closed") return;

    while (this.pending.length) {
      this.pending.shift()?.reject(error);
    }

    if (this.state !== "closing") {
      this.setState("closed");
    }
  }
  command(cmd: string, ...input: any[]) {
    let options: CommandOptions | undefined;

    if (
      input.length &&
      typeof input[input.length - 1] === "object" &&
      (input[input.length - 1].timeout !== undefined ||
        input[input.length - 1].signal)
    ) {
      options = input.pop();
    }

    const args = input;

    return new Promise((resolve, reject) => {
      const command: PendingCommand = { cmd, args, resolve, reject };

      if (options?.timeout) {
        command.timer = setTimeout(() => {
          this.cancelCommand(command, new Error("Command timeout"));
        }, options.timeout);
      }

      if (options?.signal) {
        if (options.signal.aborted) {
          return reject(new Error("Command aborted"));
        }

        options.signal.addEventListener("abort", () => {
          this.cancelCommand(command, new Error("Command aborted"));
        });
      }

      if (this.state === "ready") {
        this.execute(command);
        return;
      }

      if (this.state === "connecting" || this.state === "reconnecting") {
        if (this.offlineQueue.length >= this.maxOfflineQueue) {
          return reject(new Error("Offline queue limit exceeded"));
        }

        this.offlineQueue.push(command);
        return;
      }

      reject(new Error(`Cannot execute command in state: ${this.state}`));
    });
  }

  private execute(command: PendingCommand) {
    if (!this.socket || this.state !== "ready") {
      command.reject(
        new Error(`Cannot execute command in state: ${this.state}`),
      );
      return;
    }

    this.pending.push(command);
    const payload = encodeCommand(command.cmd, command.args);
    this.socket.write(payload);
  }
  /* ===========================
     OFFLINE + CANCEL
  =========================== */

  private flushOfflineQueue() {
    while (this.offlineQueue.length && this.state === "ready") {
      const cmd = this.offlineQueue.shift()!;
      this.execute(cmd);
    }
  }

  private cancelCommand(cmd: PendingCommand, error: Error) {
    this.offlineQueue = this.offlineQueue.filter((c) => c !== cmd);
    this.pending = this.pending.filter((c) => c !== cmd);

    if (cmd.timer) clearTimeout(cmd.timer);

    cmd.reject(error);
  }

  /* ===========================
     RECONNECT
  =========================== */

  private async handleReconnect() {
    if (this.retryCount >= this.maxRetries) {
      this.cleanup(new Error("Max reconnect attempts reached"));
      return;
    }

    this.retryCount++;
    this.setState("reconnecting");

    const delay = this.computeBackoff();
    await new Promise((r) => setTimeout(r, delay));

    try {
      await this.connect();
    } catch {
      this.handleReconnect();
    }
  }

  private computeBackoff() {
    const exp = this.baseDelay * 2 ** this.retryCount;
    const jitter = Math.random() * 100;
    return Math.min(exp + jitter, 30000);
  }

  get(key: string) {
    return this.command("GET", key);
  }

  set(key: string, value: any) {
    return this.command("SET", key, value);
  }

  del(key: string) {
    return this.command("DEL", key);
  }

  incr(key: string) {
    return this.command("INCR", key);
  }

  async quit() {
    if (this.state !== "ready") return;

    this.manualClose = true;
    this.setState("closing");

    this.socket?.end();

    this.setState("closed");
  }
}
