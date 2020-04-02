/**
 * Database Connection
 */

const mongoose = require('mongoose');

// Database Name
const dbName = '<database_name>';

// Connection URL
const dbPath = 'mongodb://127.0.0.1:27017/' + dbName;

mongoose.connect(dbPath, {
    useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

module.exports = mongoose;
