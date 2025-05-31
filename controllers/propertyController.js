const Property = require("../models/Property");
const redis = require("../config/redis");
const { setJson, getJson } = require("../utils/redis");
const PROPERTY_CACHE_PREFIX = "properties:";

exports.createProperty = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };

    if (!data.id) {
      const count = await Property.countDocuments();
      data.id = `PROP${1 + count}`;
    }

    const property = await Property.create(data);

    
    const keys = await redis.smembers("property_cache_keys");
    if (keys.length > 0) await redis.del(...keys);
    await redis.del("property_cache_keys");
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/*
 * @param()
 *
 *
 *
 */

exports.getAllProperties = async (req, res) => {
  try {
    const filter = {};

    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.price = {};
      if (!isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }
    if (req.query.rating || req.query.maxRating) {
      filter.rating = {};
      if (req.query.rating) {
        const minRating = parseFloat(req.query.rating);
        if (!isNaN(minRating)) {
          filter.rating.$gte = minRating;
        }
      }
      if (req.query.maxRating) {
        const maxRating = parseFloat(req.query.maxRating);
        if (!isNaN(maxRating)) {
          filter.rating.$lte = maxRating;
        }
      }
    }
    if (req.query.tags) {
      const tagsArray = req.query.tags?.split(",").map((tag) => tag.trim());
      filter.tags = { $all: tagsArray };
    }
    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities
        .split(",")
        .map((amenities) => amenities.trim());
      filter.amenities = { $all: amenitiesArray };
    }

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const allowedFields = [
      "furnished",
      "city",
      "state",
      "type",
      "bedrooms",
      "bathrooms",
      "listingType",
      "isVerified",
    ];

    allowedFields.forEach((field) => {
      if (req.query[field]) {
        filter[field] = req.query[field];
      }
    });
    const cacheKey = `properties:${JSON.stringify(filter)}`;
    const cached = await getJson(cacheKey);
    if (cached) {
      try {
        return res.status(200).json(cached);
      } catch (err) {
        console.error("Cache JSON parse error:", err.message, cached);
      }
    }

    const properties = await Property.find(filter);
    
    console.log("data from db----------------")
    await setJson(cacheKey, properties, { ex: 300 });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProperty = async (req, res) => {
  const prop = await Property.findById(req.params.id);
  if (!prop) return res.status(404).json({ message: "Not found" });
  res.json(prop);
};

exports.updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Not found" });
  if (property.createdBy.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  Object.assign(property, req.body);
  await property.save();
  const keys = await redis.smembers("property_cache_keys");
  if (keys.length > 0) await redis.del(...keys);
  await redis.del("property_cache_keys");
  res.json(property);
};

exports.deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Not found" });
  if (property.createdBy.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  await property.remove();
  const keys = await redis.smembers("property_cache_keys");
  if (keys.length > 0) await redis.del(...keys);
  await redis.del("property_cache_keys");
  res.json({ message: "Deleted" });
};
