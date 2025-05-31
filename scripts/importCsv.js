require("dotenv").config();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Property = require("../models/Property");
const connectDB = require("../config/db");

const parseDate = (str) => {
  const [day, month, year] = str.split("-");
  return new Date(`${day}-${month}-20${year}`);
};

const filePath = path.join(__dirname, "../data/properties.csv");

const importCSV = async () => {
  await connectDB();
  const properties = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        properties.push({
          id: row.id,
          title: row.title,
          type: row.type,
          price: Number(row.price),
          state: row.state,
          city: row.city,
          areaSqFt: Number(row.areaSqFt),
          bedrooms: Number(row.bedrooms),
          bathrooms: Number(row.bathrooms),
          amenities: row.amenities?.split("|") || [],
          furnished: row.furnished?.toLowerCase(),
          availableFrom: new Date(row.availableFrom),
          listedBy: row.listedBy,
          tags: row.tags?.split("|") || [],
          colorTheme: row.colorTheme,
          rating: parseFloat(row.rating),
          isVerified: row.isVerified?.toLowerCase() === "true",
          listingType: row.listingType?.toLowerCase(),
          createdBy: null,
        });
      } catch (err) {
        console.error("Error parsing row:", row, err);
      }
    })
    .on("end", async () => {
      try {
        await Property.insertMany(properties);
        console.log("✅ CSV imported to MongoDB!");
        process.exit(0);
      } catch (err) {
        console.error("❌ Failed to import:", err);
        process.exit(1);
      }
    });
};

importCSV();
