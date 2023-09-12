const { getGenres } = require("../controllers/genresController");

const getGenresHandler = async (req, res) => {
  try {
    //Getting genres from API and saving (if don't exists) in database
    const genres = await getGenres();
    //Response
    res.status(200).json(genres);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getGenresHandler };
