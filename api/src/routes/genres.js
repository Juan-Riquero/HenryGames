const express = require("express");
const axios = require("axios");
const { Genre } = require("../db");
const { API_KEY } = process.env;

const router = express.Router();

// --------------- GET /GENRES ---------------------//
//En una primera instancia deberán traerlos desde rawg y guardarlos en su propia base de datos  y luego ya utilizarlos desde allí

router.get("/", async (req, res) => {
  // busco los generos en mi base de datos
  let genres = await Genre.findAll();

  if (genres.length) {
    console.log("Generos enviados desde la base de datos");

  }

  // Si no tengo generos en la base de datos, los busco en la API, los guardo y los envio
  let { data } = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`
    
  );
  //console.log({data})
 /* let generos= data.results.map(el=> el.name );
 console.log(generos) */
  let genresApi = [];
  data.results.map((genre) => {
    genresApi.push({ id: genre.id, name: genre.name });
  });
  //console.log(genresApi)

  // mapeo el id y nombre de los generos en un array de objetos, para posteriormente subirlos a la base de datos con el metodo de bulkCreate

  await Genre.bulkCreate(genresApi, {
    ignoreDuplicates: true,
  });

  genres = await Genre.findAll();

  console.log("Genres metidos a base de datos y enviados");
  return res.send(genres);
});

module.exports = router;