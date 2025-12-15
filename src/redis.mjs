import net from "net";
import { encodeCommand } from "./encoder.mjs";
import { RESPParser } from "./parser.mjs";

export default class RedisClient {
  constructor({ host = "127.0.0.1", port = 6379 } = {}) {
    this.host = host;
    this.port = port;
    this.socket = null;
    this.parser = new RESPParser();
    this.pending = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(
        { host: this.host, port: this.port },
        resolve
      );

      this.socket.on("data", (data) => {
        const responses = this.parser.push(data.toString());

        responses.forEach((res) => {
          const { resolve } = this.pending.shift();
          resolve(res);
        });
      });

      this.socket.on("error", (err) => {
        while (this.pending.length) {
          this.pending.shift().reject(err);
        }
        reject(err);
      });
    });
  }

  command(cmd, ...args) {
    return new Promise((resolve, reject) => {
      const payload = encodeCommand(cmd, args);
      this.pending.push({ resolve, reject });
      this.socket.write(payload);
    });
  }

  get(key) {
    return this.command("GET", key);
  }

  set(key, value) {
    return this.command("SET", key, value);
  }

  del(key) {
    return this.command("DEL", key);
  }

  incr(key) {
    return this.command("INCR", key);
  }

  quit() {
    this.socket.end();
  }
}
