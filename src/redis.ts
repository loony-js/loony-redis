import net from "net";
import { encodeCommand } from "./encoder";
import { RESPParser } from "./parser";

export default class RedisClient {
  private host: string;
  private port: number;
  private socket: net.Socket | null = null;
  private parser = new RESPParser();
  private pending: Array<{
    resolve: (v: any) => void;
    reject: (e: any) => void;
  }> = [];
  private connected = false;

  constructor({ host = "127.0.0.1", port = 6379 } = {}) {
    this.host = host;
    this.port = port;
  }

  connect(): Promise<void> {
    if (this.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(
        { host: this.host, port: this.port },
        () => {
          this.connected = true;
          resolve();
        },
      );

      this.socket.on("data", (chunk: Buffer) => {
        const responses = this.parser.push(chunk);

        for (const res of responses) {
          const request = this.pending.shift();
          if (!request) continue;

          if (res instanceof Error) {
            request.reject(res);
          } else {
            request.resolve(res);
          }
        }
      });

      this.socket.on("error", (err) => {
        this.connected = false;
        while (this.pending.length) {
          this.pending.shift()?.reject(err);
        }
        reject(err);
      });

      this.socket.on("close", () => {
        this.connected = false;
        while (this.pending.length) {
          this.pending.shift()?.reject(new Error("Connection closed"));
        }
      });
    });
  }

  command(cmd: string, ...args: any[]): Promise<any> {
    if (!this.socket || !this.connected) {
      return Promise.reject(new Error("Not connected to Redis server"));
    }

    return new Promise((resolve, reject) => {
      const payload = encodeCommand(cmd, args);
      this.pending.push({ resolve, reject });
      this.socket!.write(payload);
    });
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

  quit() {
    if (this.socket) {
      this.socket.end();
      this.connected = false;
    }
  }
}
