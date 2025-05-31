const redis = require("../config/redis");
exports.setJson = (key, value, opts = {}) => {
  return redis.set(key, JSON.stringify(value), opts);
};

exports.getJson = async (key) => {
  const raw = await redis.get(key);
  if (!raw) return null;
  console.log("data from redis--------------");
  if (typeof raw === "object") return raw;

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error:", err.message, raw);
      return null;
    }
  }
  throw new Error("Unexpected Redis data type: " + typeof raw);
};

