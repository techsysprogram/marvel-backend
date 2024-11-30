require("dotenv").config();

const express = require("express");
const app = express(); // création du serveur
const axios = require("axios");
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur Marvel");
    console.log(process.env.API_KEY);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/character/:characterId", async (req, res) => {
  try {
    // mettre cet id dans la requete envoyée à l'API Marvel :
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/character/" +
        req.params.characterId +
        "?apiKey=" +
        process.env.API_KEY
    );

    // le serveur peut recevoir les query skip, limit et name du front
    console.log("query =>", req.query); // { name: 'spider' }
    // récupérer la réponse et la renvoyer au front
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comic/:comicId", async (req, res) => {
  try {
    // mettre cet id dans la requete envoyée à l'API Marvel :
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comic/" +
        req.params.comicId +
        "?apiKey=" +
        process.env.API_KEY
    );
    // le serveur peut recevoir les query skip, limit et name du front
    console.log("query =>", req.query); // { name: 'spider' }
    // récupérer la réponse et la renvoyer au front
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    let limit = 100;

    // le serveur peut recevoir les query skip, limit et name du front
    console.log("query =>", req.query); // { name: 'spider' }

    // mise en place des query "skip", "limit" et "name"
    let filters = "";
    if (req.query.name) {
      // si j'ai une query name envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide

      filters += `&name=${req.query.name}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      // si j'ai une query page envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide

      filters += `&skip=${(req.query.page - 1) * limit}`;
    }

    // appel à l'api avec le paramètre query apiKey : grâce au client axios
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}${filters}&limit=${limit}`
    );
    // récupérer la réponse et la renvoyer au front
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    // recevoir la requete du front (avec possiblement les query pour le skip -pagination- et title -filtres-)
    // envoyer la requete a l'API
    // let limit = 100;

    // le serveur peut recevoir les query page, limit et title du front
    console.log("query =>", req.query); // { title: 'spider' }

    // gérer l'envoi ou non des filtres (skip et title)
    let filters = "";
    if (req.query.title) {
      // si j'ai une query title envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide

      filters += `&title=${req.query.title}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      // si j'ai une query page envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide
      filters += `&skip=${(req.query.page - 1) * limit}`;
      //filters += `&skip=${req.query.page }`;
    }
    // appel à l'api avec le paramètre query apiKey : grâce au client axios
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}${filters}&limit=${limit}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    // récupérer l'id d'un personnage :
    console.log(req.params);

    // mettre cet id dans la requete envoyée à l'API Marvel :
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics/" +
        req.params.characterId +
        "?apiKey=" +
        process.env.API_KEY
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

// Mon serveur va écouter le port 3000 en local et en production, il écoutera le port défini par Northflank
const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log("Server has started 🦸‍♂️");
});
