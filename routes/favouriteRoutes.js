const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favouriteController");
/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorite properties management
 */

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a property to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *             properties:
 *               propertyId:
 *                 type: string
 *                 description: ID of the property to favorite
 *     responses:
 *       201:
 *         description: Property added to favorites
 */
router.post("/", auth, addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all favorite properties of the logged-in user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite properties
 */
router.get("/", auth, getFavorites);

/**
 * @swagger
 * /favorites/{propertyId}:
 *   delete:
 *     summary: Remove a property from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the property to remove from favorites
 *     responses:
 *       200:
 *         description: Property removed from favorites
 */
router.delete("/:propertyId", auth, removeFavorite);

module.exports = router;


router.post("/", auth, addFavorite);
router.get("/", auth, getFavorites);
router.delete("/:propertyId", auth, removeFavorite);

module.exports = router;
