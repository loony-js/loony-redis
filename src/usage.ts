import RedisClient from "./index";

(async () => {
  const redis = new RedisClient();

  try {
    await redis.connect();

    console.log("Connected\n");

    // -----------------------------
    // 1️⃣ Basic set/get
    // -----------------------------
    await redis.set("user:1:name", "Sankar");
    console.log("Name:", await redis.get("user:1:name"));

    // -----------------------------
    // 2️⃣ Pipelining (parallel execution)
    // -----------------------------
    const pipeline = [
      redis.set("counter", 0),
      redis.incr("counter"),
      redis.incr("counter"),
      redis.get("counter"),
    ];

    const results = await Promise.all(pipeline);
    console.log("Pipeline results:", results);

    // -----------------------------
    // 3️⃣ Handling null responses
    // -----------------------------
    const missing = await redis.get("does:not:exist");
    console.log("Missing key:", missing); // should be null

    // -----------------------------
    // 4️⃣ Working with binary data
    // -----------------------------
    const bufferValue = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
    await redis.set("binary:key", bufferValue);

    const binaryResult = await redis.get("binary:key");
    console.log("Binary result:", binaryResult);

    // -----------------------------
    // 5️⃣ Array responses (example using MGET)
    // -----------------------------
    await redis.set("a", "1");
    await redis.set("b", "2");

    const values = await redis.command("MGET", "a", "b", "c");
    console.log("MGET:", values); // ["1", "2", null]

    // -----------------------------
    // 6️⃣ Redis error handling
    // -----------------------------
    try {
      // WRONGTYPE: INCR on string
      await redis.set("mykey", "hello");
      await redis.incr("mykey");
    } catch (err: any) {
      console.error("Redis error:", err.message);
    }

    // -----------------------------
    // 7️⃣ Clean shutdown
    // -----------------------------
    redis.quit();

    // Try using after quit (should fail)
    await redis.get("a");
  } catch (err: any) {
    console.error("Client error:", err.message);
  }
})();
