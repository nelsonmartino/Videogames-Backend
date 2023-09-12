const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogamesRouter = require("./videogamesRouter");
const genresRouter = require("./genresRouter");

const routes = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

routes.use("/videogames", videogamesRouter);

routes.use("/genres", genresRouter);

module.exports = routes;
