"use strict";
const mongoose = require("mongoose");
const { mongoConfig } = require("./config");

function dbSetUp()
{
    mongoose.connect(mongoConfig.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
        console.log("Connected to mongoDB");
    });

    mongoose.connection.on("error", err => {
        console.log("Not connected to mongoDB", err);
    });
}

const MongusSchema = mongoose.Schema;
const FilmSchema = new MongusSchema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Date,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    actors: {
        type: [String],
        required: true
    },
});

const film = mongoose.model("films", FilmSchema);

async function saveFilm(inFilm)
{
    const filmToSave = new film(inFilm);
    const saveResult = await filmToSave.save();
    return saveResult;
}

async function findAllFilms()
{
    const findResult = await film.find();
    return findResult;
}

async function findFilmByID(id)
{
    const monId = new mongoose.Types.ObjectId(id);
    const findResult = await film.findById(monId);
    return findResult;
}

async function updateFilm(id, newFilm)
{
    const monId = new mongoose.Types.ObjectId(id);
    const updateResult = await film.updateOne({ _id: monId }, { $set : newFilm});
    return updateResult;
}

async function deleteFilm(id)
{
    const monId = new mongoose.Types.ObjectId(id);
    const deleteResult = film.deleteOne({_id : monId});
    return deleteResult;
}

async function findFilmsByGenre(genre)
{
    const foundFilms = await film.find({ genre: genre });
    return foundFilms;
}

async function findFilmsByName(name)
{
    const foundFilms = await film.find({ name: name });
    return foundFilms;
}

module.exports = {
    saveFilm,
    findFilmByID,
    findAllFilms,
    updateFilm,
    deleteFilm,
    dbSetUp,
    findFilmsByGenre,
    findFilmsByName
}
