import RedisClient from "./index";

(async () => {
  const redis = new RedisClient({
    reconnect: true,
    maxRetries: 5,
    baseDelay: 200,
    maxOfflineQueue: 500,
  });

  try {
    await redis.connect();
    console.log("Connected\n");

    // --------------------------------------------------
    // 1️⃣ Basic set/get
    // --------------------------------------------------
    await redis.command("SET", "user:1:name", "Sankar");
    const name = await redis.command("GET", "user:1:name");
    console.log("Name:", name?.toString());

    // --------------------------------------------------
    // 2️⃣ Pipelining (parallel execution)
    // --------------------------------------------------
    const pipeline = [
      redis.command("SET", "counter", 0),
      redis.command("INCR", "counter"),
      redis.command("INCR", "counter"),
      redis.command("GET", "counter"),
    ];

    const results = await Promise.all(pipeline);
    console.log(
      "Pipeline results:",
      results.map((r) => (Buffer.isBuffer(r) ? r.toString() : r)),
    );

    // --------------------------------------------------
    // 3️⃣ Handling null responses
    // --------------------------------------------------
    const missing = await redis.command("GET", "does:not:exist");
    console.log("Missing key:", missing);

    // --------------------------------------------------
    // 4️⃣ Working with binary data
    // --------------------------------------------------
    const bufferValue = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
    await redis.command("SET", "binary:key", bufferValue);

    const binaryResult = await redis.command("GET", "binary:key");
    console.log("Binary result:", binaryResult);

    // --------------------------------------------------
    // 5️⃣ Array responses (MGET)
    // --------------------------------------------------
    await redis.command("SET", "a", "1");
    await redis.command("SET", "b", "2");

    const values: any = await redis.command("MGET", "a", "b", "c");
    console.log(
      "MGET:",
      values.map((v: any) => (v ? v.toString() : null)),
    );

    // --------------------------------------------------
    // 6️⃣ Timeout example
    // --------------------------------------------------
    try {
      await redis.command("DEBUG", "SLEEP", 3, { timeout: 1000 });
    } catch (err: any) {
      console.error("Timeout triggered:", err.message);
    }

    // --------------------------------------------------
    // 7️⃣ AbortController example
    // --------------------------------------------------
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 500);

    try {
      await redis.command("GET", "user:1:name", { signal: controller.signal });
    } catch (err: any) {
      console.error("Aborted:", err.message);
    }

    // --------------------------------------------------
    // 8️⃣ Heavy parallel load
    // --------------------------------------------------
    const writes = [];
    for (let i = 0; i < 100; i++) {
      writes.push(redis.command("SET", `k${i}`, i));
    }

    await Promise.all(writes);
    console.log("100 parallel writes completed");

    // --------------------------------------------------
    // 9️⃣ Error handling
    // --------------------------------------------------
    try {
      await redis.command("SET", "mykey", "hello");
      await redis.command("INCR", "mykey");
    } catch (err: any) {
      console.error("Redis error:", err.message);
    }

    // --------------------------------------------------
    // 🔟 Simulate reconnect behavior
    // --------------------------------------------------
    console.log("\nNow kill Redis server manually...");
    console.log("Client will auto-reconnect.\n");

    // This will queue during reconnect if Redis is down
    setTimeout(async () => {
      try {
        const val = await redis.command("GET", "user:1:name", {
          timeout: 5000,
        });
        console.log("Recovered after reconnect:", val?.toString());
      } catch (err: any) {
        console.error("Reconnect test failed:", err.message);
      }
    }, 2000);

    // --------------------------------------------------
    // 1️⃣1️⃣ Graceful shutdown
    // --------------------------------------------------
    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      await redis.quit();
      process.exit(0);
    });
  } catch (err: any) {
    console.error("Client error:", err.message);
  }
})();
