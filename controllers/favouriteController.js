const Favorite = require("../models/Favourite");

exports.addFavorite = async (req, res) => {
  const fav = await Favorite.create({
    user: req.user.id,
    property: req.body.propertyId,
  });
  res.status(201).json(fav);
};

exports.getFavorites = async (req, res) => {
  const favs = await Favorite.find({ user: req.user.id }).populate("property");
  res.json(favs);
};

exports.removeFavorite = async (req, res) => {
  const fav = await Favorite.findOneAndDelete({
    user: req.user.id,
    property: req.params.propertyId,
  });
  res.json({ message: "Removed" });
};
