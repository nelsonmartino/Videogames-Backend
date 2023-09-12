const { Router } = require("express");
const {
  getVideogamesHandler,
  getVideogameByNameHandler,
  getVideogameByIdHandler,
  postVideogameHandler,
  deleteVideogameByIdHandler,
} = require("../handlers/videogamesHandlers");

const videogamesRouter = Router();

videogamesRouter.get("/", getVideogamesHandler);

videogamesRouter.get("/name", getVideogameByNameHandler);

videogamesRouter.get("/:idVideogame", getVideogameByIdHandler);

videogamesRouter.post("/", postVideogameHandler);

videogamesRouter.delete("/:idVideogame", deleteVideogameByIdHandler);

module.exports = videogamesRouter;
