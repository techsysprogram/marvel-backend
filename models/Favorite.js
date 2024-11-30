const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  characters: [{ type: Object }], // Stocke les personnages favoris
  comics: [{ type: Object }],     // Stocke les comics favoris
});

module.exports = Favorite;
