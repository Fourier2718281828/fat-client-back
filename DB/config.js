"use strict"

const dbName = "RestAppDB"

const mongoConfig = {
    db: `mongodb+srv://nonlinear:z108197@cluster0.euxhbow.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    secret: "secret_code",
}

module.exports = { mongoConfig }