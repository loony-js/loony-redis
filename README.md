**Redis client built completely from scratch**.
It speaks **RESP (Redis Serialization Protocol)** directly over a TCP socket.

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
