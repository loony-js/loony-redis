Listing **all Redis commands** verbatim isn’t practical here (Redis has 250+ commands and subcommands), but below is a **complete, categorized reference** covering the full command set available in modern Redis (7.x series).

---

# 🔹 Server & Connection Commands

- `AUTH`
- `HELLO`
- `PING`
- `QUIT`
- `SELECT`
- `RESET`

---

# 🔹 Keys & Generic Commands

- `DEL`
- `UNLINK`
- `EXISTS`
- `EXPIRE`
- `EXPIREAT`
- `PEXPIRE`
- `PEXPIREAT`
- `TTL`
- `PTTL`
- `PERSIST`
- `TYPE`
- `KEYS`
- `SCAN`
- `RENAME`
- `RENAMENX`
- `MOVE`
- `COPY`
- `RANDOMKEY`
- `TOUCH`
- `DUMP`
- `RESTORE`
- `SORT`
- `WAIT`
- `WAITAOF`

---

# 🔹 String Commands

- `SET`
- `GET`
- `GETSET`
- `SETNX`
- `SETEX`
- `PSETEX`
- `MSET`
- `MSETNX`
- `MGET`
- `APPEND`
- `STRLEN`
- `INCR`
- `INCRBY`
- `INCRBYFLOAT`
- `DECR`
- `DECRBY`
- `GETRANGE`
- `SETRANGE`
- `GETDEL`
- `GETEX`
- `LCS`

---

# 🔹 Hash Commands

- `HSET`
- `HSETNX`
- `HGET`
- `HMSET` (deprecated)
- `HMGET`
- `HDEL`
- `HEXISTS`
- `HGETALL`
- `HKEYS`
- `HVALS`
- `HLEN`
- `HSTRLEN`
- `HINCRBY`
- `HINCRBYFLOAT`
- `HRANDFIELD`
- `HSCAN`

---

# 🔹 List Commands

- `LPUSH`
- `RPUSH`
- `LPUSHX`
- `RPUSHX`
- `LPOP`
- `RPOP`
- `BLPOP`
- `BRPOP`
- `BRPOPLPUSH`
- `LMOVE`
- `BLMOVE`
- `LLEN`
- `LINDEX`
- `LINSERT`
- `LSET`
- `LRANGE`
- `LTRIM`
- `LREM`
- `RPOPLPUSH`

---

# 🔹 Set Commands

- `SADD`
- `SREM`
- `SMOVE`
- `SPOP`
- `SRANDMEMBER`
- `SCARD`
- `SISMEMBER`
- `SMISMEMBER`
- `SMEMBERS`
- `SINTER`
- `SINTERSTORE`
- `SINTERCARD`
- `SUNION`
- `SUNIONSTORE`
- `SDIFF`
- `SDIFFSTORE`
- `SSCAN`

---

# 🔹 Sorted Set Commands

- `ZADD`
- `ZREM`
- `ZINCRBY`
- `ZSCORE`
- `ZMSCORE`
- `ZRANGE`
- `ZRANGEBYSCORE`
- `ZRANGEBYLEX`
- `ZREVRANGE`
- `ZREVRANGEBYSCORE`
- `ZREVRANGEBYLEX`
- `ZCOUNT`
- `ZLEXCOUNT`
- `ZCARD`
- `ZREMrangebyrank`
- `ZREMRANGEBYSCORE`
- `ZREMRANGEBYLEX`
- `ZPOPMIN`
- `ZPOPMAX`
- `BZPOPMIN`
- `BZPOPMAX`
- `ZRANDMEMBER`
- `ZINTER`
- `ZINTERSTORE`
- `ZINTERCARD`
- `ZUNION`
- `ZUNIONSTORE`
- `ZSCAN`
- `ZRANGESTORE`

---

# 🔹 Streams Commands

- `XADD`
- `XDEL`
- `XLEN`
- `XRANGE`
- `XREVRANGE`
- `XREAD`
- `XREADGROUP`
- `XGROUP`
- `XACK`
- `XAUTOCLAIM`
- `XCLAIM`
- `XPENDING`
- `XINFO`
- `XTRIM`
- `XSETID`

---

# 🔹 Pub/Sub Commands

- `SUBSCRIBE`
- `PSUBSCRIBE`
- `UNSUBSCRIBE`
- `PUNSUBSCRIBE`
- `PUBLISH`
- `PUBSUB`
- `SSUBSCRIBE`
- `SUNSUBSCRIBE`
- `SPUBLISH`

---

# 🔹 Transactions

- `MULTI`
- `EXEC`
- `DISCARD`
- `WATCH`
- `UNWATCH`

---

# 🔹 Scripting

- `EVAL`
- `EVALSHA`
- `SCRIPT LOAD`
- `SCRIPT EXISTS`
- `SCRIPT FLUSH`
- `SCRIPT KILL`
- `FCALL`
- `FCALL_RO`
- `FUNCTION LOAD`
- `FUNCTION DELETE`
- `FUNCTION LIST`
- `FUNCTION FLUSH`
- `FUNCTION STATS`
- `FUNCTION DUMP`
- `FUNCTION RESTORE`
- `FUNCTION KILL`

---

# 🔹 Server Management

- `INFO`
- `CONFIG GET`
- `CONFIG SET`
- `CONFIG RESETSTAT`
- `CONFIG REWRITE`
- `SAVE`
- `BGSAVE`
- `BGREWRITEAOF`
- `LASTSAVE`
- `SHUTDOWN`
- `FLUSHDB`
- `FLUSHALL`
- `DBSIZE`
- `TIME`
- `SLOWLOG`
- `MONITOR`
- `ROLE`
- `COMMAND`
- `MEMORY`
- `MODULE`
- `LATENCY`
- `ACL`
- `FAILOVER`
- `CLUSTER`

---

# 🔹 HyperLogLog

- `PFADD`
- `PFCOUNT`
- `PFMERGE`

---

# 🔹 Geo Commands

- `GEOADD`
- `GEODIST`
- `GEOHASH`
- `GEOPOS`
- `GEORADIUS` (deprecated)
- `GEORADIUSBYMEMBER` (deprecated)
- `GEOSEARCH`
- `GEOSEARCHSTORE`

---

# 🔹 Bitmap & Bitfield

- `SETBIT`
- `GETBIT`
- `BITCOUNT`
- `BITPOS`
- `BITOP`
- `BITFIELD`
- `BITFIELD_RO`

---

# 🔹 Cluster Commands

- `CLUSTER INFO`
- `CLUSTER NODES`
- `CLUSTER MEET`
- `CLUSTER RESET`
- `CLUSTER SLOTS`
- `CLUSTER KEYSLOT`
- `CLUSTER REPLICAS`
- `CLUSTER FORGET`
- `CLUSTER FAILOVER`
- `CLUSTER SETSLOT`
- `CLUSTER ADDSLOTS`
- `CLUSTER DELSLOTS`
- `CLUSTER COUNTKEYSINSLOT`
- `CLUSTER GETKEYSINSLOT`
- `READONLY`
- `READWRITE`
- `ASKING`

---

# 🔹 Replication

- `REPLICAOF`
- `PSYNC`
- `SYNC`

---

# 🔹 Modules (Dynamic)

- `MODULE LOAD`
- `MODULE UNLOAD`
- `MODULE LIST`

---

If you'd like, I can also provide:

- 📘 Command examples with syntax
- 📊 Commands grouped by data structure with real use cases
- 🧠 Most commonly used commands for interviews
- ⚡ Redis commands cheat sheet PDF style
- 🧪 Practical examples for backend development (Node / Java / Python)

Just tell me what you prefer.
