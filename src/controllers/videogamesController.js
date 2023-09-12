const { Videogame, Genre } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Op } = require("sequelize");
const {
  arrangeApiData,
  arrangeApiDataId,
  arrangeDbData,
  arrangeDbDataId,
} = require("../utils/dataArrange");

const getDbVideogames = async () => {
  //Getting videogames from database
  let dbVideogames = await Videogame.findAll({
    include: {
      model: Genre,
      atributes: ["name"],
      through: {
        atributes: [],
      },
    },
  });
  //Desctructuring and getting needed information and returning
  return dbVideogames.map((dbVideogame) => arrangeDbData(dbVideogame));
};

const getApiVideogames = async () => {
  //Getting videogames from API (120 first results)
  let results = [];
  for (let i = 1; i <= 3; i++)
    results = [
      ...results,
      ...(
        await axios.get(
          `https://api.rawg.io/api/games?page=${i}&page_size=40&key=${API_KEY}`
        )
      ).data.results,
    ];
  //Desctructuring and getting needed information and returning
  return results.map((apiVideogame) => arrangeApiData(apiVideogame));
};

const getDbVideogameByName = async (search) => {
  //Getting videogames from database:
  // * Including genre from Genre model
  // * Searching by name, case unsensitive
  // * Limit 15 results
  let dbVideogames = await Videogame.findAll(
    {
      where: { name: { [Op.iLike]: `%${search}%` } },
      include: {
        model: Genre,
        atributes: ["name"],
        through: {
          atributes: [],
        },
      },
    },
    { limit: 15 }
  );
  //Desctructuring and getting needed information and returning
  return dbVideogames.map((dbVideogame) => arrangeDbData(dbVideogame));
};

const getApiVideogamesByName = async (search) => {
  // Getting videogames array from API
  const { data } = await axios.get(
    `https://api.rawg.io/api/games?search=${search}&key=${API_KEY}`
  );
  //Desctructuring and getting needed information and returning
  return data.results.map((apiVideogame) => arrangeApiData(apiVideogame));
};

const getVideogameById = async (idVideogame) => {
  if (isNaN(idVideogame)) {
    const data = await Videogame.findByPk(idVideogame, {
      include: {
        model: Genre,
        atributes: ["name"],
        through: {
          atributes: [],
        },
      },
    });
    return arrangeDbDataId(data);
  } else {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`
    );
    return arrangeApiDataId(data);
  }
};

const postVideogame = async (
  name,
  description,
  platforms,
  background_image,
  released,
  rating,
  genres
) => {
  //Creating new videogame in database from data received
  const newGame = await Videogame.create({
    name,
    description,
    platforms,
    background_image,
    released,
    rating,
  });
  //Adding received genres as relation in Genre model
  await newGame.addGenres(genres);
  //Returning created game
  return newGame;
};

const deleteVideogameById = async (idVideogame) => {
  const videogame = await Videogame.findByPk(idVideogame);
  await videogame.destroy();
  return getDbVideogames();
};

module.exports = {
  getDbVideogames,
  getApiVideogames,
  getDbVideogameByName,
  getApiVideogamesByName,
  getVideogameById,
  postVideogame,
  deleteVideogameById,
};
