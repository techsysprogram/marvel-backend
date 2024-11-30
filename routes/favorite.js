const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Favorite = require("../models/Favorite");

// Route GET pour récupérer les favoris
router.get("/favorite/get", isAuthenticated, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ userId: req.user._id });

    if (!favorite) {
      return res.status(200).json({ characters: [], comics: [] }); // Favoris vides
    }

    res.status(200).json({
      characters: favorite.characters,
      comics: favorite.comics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route POST pour sauvegarder les favoris
router.post("/favorite/save", isAuthenticated, async (req, res) => {
  try {
    const { characters, comics } = req.body;

    if (!characters || !comics) {
      return res.status(400).json({ message: "Characters and Comics are required" });
    }

    let favorite = await Favorite.findOne({ userId: req.user._id });

    if (!favorite) {
      // Créer un nouvel enregistrement si aucun favori n'existe pour cet utilisateur
      favorite = new Favorite({
        userId: req.user._id,
        characters,
        comics,
      });
    } else {
      // Mettre à jour les favoris existants
      favorite.characters = characters;
      favorite.comics = comics;
    }

    await favorite.save();

    res.status(200).json({ message: "Favorites saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
