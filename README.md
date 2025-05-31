# 🏠 Property Listing API

A RESTful backend API built with Node.js, Express, and MongoDB to manage property listings, user authentication, and favorites. Includes Swagger documentation and Redis caching for performance.

---

## 📌 Features

- 🔐 JWT-based Authentication
- 🏡 Property CRUD operations
- ❤️ Add/Remove Property Favorites
- 🔍 Filter & Search Properties (price, rating, amenities, etc.)
- ⚡ Redis Caching for improved performance
- 📘 Swagger UI for interactive API docs

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Token)
- **Cache**: Redis
- **Docs**: Swagger (OpenAPI)
- **Deployment**: Render

---
📘 API Docs (Swagger)
Interactive documentation available at: [View Swagger API Documentation](https://hypergrobackendassignment.onrender.com/api-docs)

---

##🧪 API Endpoints

🔐 Authentication

POST /auth/register

POST /auth/login

🏠 Properties

GET /properties — Get all properties (supports filters)

GET /properties/:id — Get a single property

POST /properties — Create property (requires auth)

PUT /properties/:id — Update property (requires auth)

DELETE /properties/:id — Delete property (requires auth)

❤️ Favorites

GET /favorites — Get user’s favorite properties

POST /favorites — Add property to favorites

DELETE /favorites/:propertyId — Remove from favorites

---

🔍 Filters Supported
Query parameters for /properties:

minPrice, maxPrice

rating, maxRating

tags, amenities

furnished, city, state

type, bedrooms, bathrooms, listingType

isVerified, title
