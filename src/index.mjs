import RedisClient from "./redis.mjs";

const options = { host: "127.0.0.1", port: 6379 };
const redis = new RedisClient(options);

await redis.connect();

await redis.set("count", 1);
console.log(await redis.get("count")); // "1"

await redis.incr("count");
console.log(await redis.get("count")); // "2"

// await redis.del("count");
redis.quit();
