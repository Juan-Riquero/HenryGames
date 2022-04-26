const axios = require("axios");
const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const genresRoutes = require("./genres");
const videogameRoutes = require("./videogame");
const videogamesRoutes = require("./videogames");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/videogames", videogamesRoutes); // GETS
router.use("/genres", genresRoutes); // GET
router.use("/videogame", videogameRoutes); // POST
module.exports = router;