import Redis from "ioredis";

const redis = new Redis(process.env.serviceUri, {
  retryStrategy: (times) => Math.min(times * 50, 2000), // Auto-reconnect strategy
});

// redis.flushdb();

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export default redis;