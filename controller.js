const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
const {
    saveFilm,
    findFilmByID,
    findAllFilms,
    updateFilm,
    deleteFilm,
    dbSetUp,
    findFilmsByGenre,
    findFilmsByName
} = require("./DB/database");


app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbSetUp();
});

app.post("/login", (req, res) => {
    console.log("Body:", req.body);
    console.log("Body.data:", req.body.data);
    const { login, password } = req.body.data;
    if(login === "admin" && password === "admin")
    {
        res.status(200).send();
    }
    else
    {
        res.status(401).send();
    }
});

app.post("/film", async (req, res) => {
    try {
        await saveFilm(req.body);
        res.send("Saved successfully.");
    }
    catch (err) {
        res.send(`Save error: ${ err.message }.`);
    }
});

app.get("/film/id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await findFilmByID(id);
        if(!result)
            res.send(`No film with id ${id} was found.`);
        else
            res.send(result);
    }
    catch (err) {
        res.send(`Find error: ${ err.message }.`);
    }
});

app.get("/films", async (req, res) => {
    try {
        const foundFilms = await findAllFilms();
        res.send(foundFilms);
    }
    catch (err) {
        res.send(`Find all error: ${ err.message }.`);
    }
});

app.patch("/film", async (req, res) => {
    try {
        const body = req.body;
        const id = body.id;
        if(id === undefined)
            res.send("Update error: body must contain id field.");

        const updatedFields = {...body};
        delete updatedFields.id;
        const updated = await updateFilm(id, updatedFields);

        if(updated.matchedCount === 0)
            res.send(`Film with id ${id} does not exist.`);
        else
            res.send(`Successful update of film with id ${id}.`);
    }
    catch (err) {
        res.send(`Update error: ${ err.message }`);
    }
});

app.delete("/film/id/:id", async (req, res) => {

    try {
        const id = req.params.id;
        const deleted = await deleteFilm(id);
        if(deleted.deletedCount === 0)
            res.send(`Film with id ${id} does not exist.`);
        else
            res.send(`Successful delete of film with id ${id}`);
    }
    catch (err) {
        res.send(`Delete error: ${ err.message }`);
    }
});

app.get("/film/name/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const result = await findFilmsByName(name);
        if(!result)
            res.send(`No film with name ${name} was found.`);
        else
            res.send(result);
    }
    catch (err) {
        res.send(`Find error: ${ err.message }.`);
    }
});

app.get("/film/genre/:genre", async (req, res) => {
    try {
        const genre = req.params.genre;
        const result = await findFilmsByGenre(genre);
        if(!result)
            res.send(`No film with genre ${genre} was found.`);
        else
            res.send(result);
    }
    catch (err) {
        res.send(`Find error: ${ err.message }.`);
    }
});