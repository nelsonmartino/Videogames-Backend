const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Genre } = require("../db");

const getGenres = async () => {
  //Get genres information from API
  const { data } = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`
  );
  //Desctructuring and getting needed information
  const genres = data.results.map((result) => {
    const { id, name } = result;
    return { id, name };
  });
  //Creating regitries at database (Genre) model if don't exists
  for (let i = 0; i < genres.length; i++) {
    await Genre.findOrCreate({
      where: { id: genres[i].id },
      defaults: { name: genres[i].name },
    });
  }
  //Returning genres array
  return genres;
};

module.exports = { getGenres };
