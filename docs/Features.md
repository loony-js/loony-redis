Here’s a comprehensive list of features available in the official Node.js Redis client:

## Redis Ltd. — redis (node-redis)

---

# Core Connection Features

- TCP connection to Redis server
- TLS/SSL support
- Unix domain socket support
- Authentication (AUTH)
- ACL username/password support
- Automatic reconnection with backoff
- Custom reconnection strategies
- Connection timeout handling
- Socket keepalive support
- DNS lookup customization
- Offline queue (queue commands before ready)
- Graceful shutdown

---

# Command Execution

- Full Redis command coverage (auto-generated from Redis command specs)
- Raw `sendCommand()` support
- Command pipelining
- Auto-pipelining (batching in same tick)
- Command aborting
- Command timeouts
- Custom command definition
- Script (Lua) helpers

---

# Data Handling

- UTF-8 string responses (default)
- `returnBuffers` mode
- Automatic number parsing
- Automatic boolean parsing
- Custom reply transformers
- RESP2 support
- RESP3 support (new types: map, set, blob, etc.)

---

# Transactions

- MULTI / EXEC support
- WATCH / UNWATCH
- DISCARD
- Transaction chaining API

---

# Pub/Sub

- Dedicated subscriber connections
- Subscribe / PSubscribe
- Pattern subscriptions
- Unsubscribe handling
- Automatic reconnection of subscriptions
- Event-driven message handling

---

# Redis Modules Support

Full support for module commands including:

- RedisJSON
- RediSearch
- RedisBloom
- RedisTimeSeries
- RedisGraph

---

# Cluster Support

- Redis Cluster auto-discovery
- Slot cache management
- Automatic MOVED/ASK redirection handling
- Cross-slot detection
- Smart command routing to correct node
- Cluster-aware pipelining

---

# Sentinel Support

- Sentinel discovery
- Automatic master failover detection
- Reconnection to new master
- Multiple sentinel support

---

# Scripting

- EVAL
- EVALSHA
- Script caching
- defineCommand() helper

---

# Streams Support

- XADD
- XREAD
- XREADGROUP
- Consumer group management
- Blocking stream reads

---

# Events

Client emits events like:

- `connect`
- `ready`
- `error`
- `reconnecting`
- `end`

---

# Advanced Features

- AbortController support
- Auto command retries
- Custom command arguments transformation
- Client-side caching (RESP3 tracking)
- Isolation pool (dedicated connections for blocking commands)
- TypeScript full typings
- Promise-based API (no callbacks)
- ESM + CommonJS support

---

# Performance Optimizations

- Auto-pipelining
- Minimal memory allocations
- Efficient RESP parsing
- Lazy command building
- Smart reconnection strategies

---

# What Your Current Client Already Has

You currently support:

- RESP2 parsing
- Binary-safe encoder
- Basic pipelining
- Error propagation
- Basic commands (GET/SET/DEL/INCR)
- Clean shutdown

---

# What You’d Need to Match node-redis

To reach feature parity you’d still need:

- Auto-reconnect with backoff
- Offline queue
- Auto-pipelining
- Command timeouts
- Pub/Sub mode
- Transactions
- Cluster support
- Sentinel support
- TLS
- RESP3 support
- Module helpers
- Client-side caching
- Isolation pools

---

If you'd like, I can:

- Rank these features by implementation difficulty
- Design a roadmap for turning your client into a production competitor
- Or help you implement the next major feature step-by-step

You're already past the “basic protocol” stage — now it's architectural scaling.
