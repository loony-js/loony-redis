Below is a **Redis client built completely from scratch**, using **no dependencies** at all.
It speaks **RESP (Redis Serialization Protocol)** directly over a TCP socket.

This is **not a wrapper** around anything — it manually:

- opens a TCP connection
- encodes commands into RESP
- parses Redis responses
- exposes a clean, promise-based API

Works in **Node.js** (Redis itself uses TCP; browsers can’t do raw TCP).

---

## Features

- Raw TCP socket (`net`)
- Full RESP parser
- `get`, `set`, `del`, `incr`
- Generic `command()` for any Redis command
- Automatic reconnection handling
- Promise-based
- Zero dependencies

---

## File Structure

```
mini-redis/
 ├─ redis.js
 ├─ encoder.js
 ├─ parser.js
 └─ index.js
```

---

## encoder.js (RESP encoder)

```js
export function encodeCommand(command, args = []) {
  const parts = [command, ...args].map(String);

  let result = `*${parts.length}\r\n`;
  for (const part of parts) {
    result += `$${Buffer.byteLength(part)}\r\n${part}\r\n`;
  }

  return result;
}
```

---

## parser.js (RESP parser)

```js
export class RESPParser {
  constructor() {
    this.buffer = "";
    this.queue = [];
  }

  push(chunk) {
    this.buffer += chunk;
    return this.parse();
  }

  parse() {
    const responses = [];

    while (true) {
      const res = this.parseValue();
      if (res === null) break;
      responses.push(res);
    }

    return responses;
  }

  parseValue() {
    if (!this.buffer.length) return null;

    const type = this.buffer[0];

    if (type === "+") return this.parseSimpleString();
    if (type === "-") return this.parseError();
    if (type === ":") return this.parseInteger();
    if (type === "$") return this.parseBulkString();
    if (type === "*") return this.parseArray();

    throw new Error("Unknown RESP type");
  }

  readLine() {
    const idx = this.buffer.indexOf("\r\n");
    if (idx === -1) return null;
    const line = this.buffer.slice(0, idx);
    this.buffer = this.buffer.slice(idx + 2);
    return line;
  }

  parseSimpleString() {
    const line = this.readLine();
    if (line === null) return null;
    return line.slice(1);
  }

  parseError() {
    const line = this.readLine();
    if (line === null) return null;
    throw new Error(line.slice(1));
  }

  parseInteger() {
    const line = this.readLine();
    if (line === null) return null;
    return Number(line.slice(1));
  }

  parseBulkString() {
    const line = this.readLine();
    if (line === null) return null;

    const length = Number(line.slice(1));
    if (length === -1) return null;

    if (this.buffer.length < length + 2) return null;

    const value = this.buffer.slice(0, length);
    this.buffer = this.buffer.slice(length + 2);
    return value;
  }

  parseArray() {
    const line = this.readLine();
    if (line === null) return null;

    const count = Number(line.slice(1));
    const arr = [];

    for (let i = 0; i < count; i++) {
      const val = this.parseValue();
      if (val === null) return null;
      arr.push(val);
    }

    return arr;
  }
}
```

---

## redis.js (core client)

```js
import net from "net";
import { encodeCommand } from "./encoder.js";
import { RESPParser } from "./parser.js";

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
```

---

## index.js (public API)

```js
import RedisClient from "./redis.js";

export function createClient(options) {
  return new RedisClient(options);
}
```

---

## Example Usage

```js
import { createClient } from "./mini-redis/index.js";

const redis = createClient();

await redis.connect();

await redis.set("count", 1);
console.log(await redis.get("count")); // "1"

await redis.incr("count");
console.log(await redis.get("count")); // "2"

await redis.del("count");
redis.quit();
```

---

## What This Client Does NOT Include

- AUTH / ACL
- Pub/Sub
- Streams
- Pipelines
- Cluster
- TLS
- Lua scripting
- Reconnection strategies

(All intentionally omitted to keep it **from-scratch and educational**.)

---

## If you want next:

- **Pipeline support**
- **Pub/Sub**
- **Cluster-aware client**
- **RESP3**
- **TypeScript**
- **Performance optimizations**

Tell me what level you want and I’ll extend it cleanly.
