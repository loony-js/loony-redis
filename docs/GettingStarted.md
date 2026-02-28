To get started with **Redis**, you only need a small set of commonly used commands. Here’s a practical beginner-friendly list with examples you can try immediately.

---

## 🔹 1. Connect & Test

```bash
redis-cli
```

```bash
PING
```

✅ Response: `PONG`

---

## 🔹 2. Strings (Most Common)

### ➤ Set a value

```bash
SET name "Sankar"
```

### ➤ Get a value

```bash
GET name
```

### ➤ Update value

```bash
SET name "RedisUser"
```

### ➤ Delete key

```bash
DEL name
```

### ➤ Increment number

```bash
SET counter 1
INCR counter
INCRBY counter 5
```

---

## 🔹 3. Expiry (Very Important in Real Projects)

### ➤ Set expiry in seconds

```bash
SET token "abc123"
EXPIRE token 60
```

### ➤ Set value with expiry directly

```bash
SET session "xyz" EX 120
```

### ➤ Check remaining time

```bash
TTL session
```

---

## 🔹 4. Lists (Queues / Message Processing)

### ➤ Push data

```bash
LPUSH tasks "task1"
RPUSH tasks "task2"
```

### ➤ View list

```bash
LRANGE tasks 0 -1
```

### ➤ Pop item

```bash
LPOP tasks
```

---

## 🔹 5. Sets (Unique Values)

### ➤ Add values

```bash
SADD users "user1" "user2"
```

### ➤ View members

```bash
SMEMBERS users
```

### ➤ Check membership

```bash
SISMEMBER users "user1"
```

---

## 🔹 6. Hashes (Like JSON Object / Map)

### ➤ Set fields

```bash
HSET user:1 name "Sankar" age 25
```

### ➤ Get one field

```bash
HGET user:1 name
```

### ➤ Get all fields

```bash
HGETALL user:1
```

---

## 🔹 7. Useful Key Commands

```bash
KEYS *
```

⚠️ Not recommended in production (use SCAN instead)

```bash
SCAN 0
```

```bash
TYPE user:1
```

```bash
EXISTS user:1
```

---

# 🚀 Minimal Commands You’ll Use Daily

If you're building backend systems, focus first on:

- `SET`
- `GET`
- `DEL`
- `EXPIRE`
- `INCR`
- `HSET`
- `HGET`
- `LPUSH`
- `LRANGE`
- `SADD`
- `SMEMBERS`

---

If you'd like, I can next give you:

- 🔥 Redis for backend developers (real-world examples)
- 🧠 Interview-focused important commands
- ⚡ Redis caching pattern examples
- 🛠 Mini project example using Redis

What would you like next?
