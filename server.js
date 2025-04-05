const { Client } = require("pg");
require('dotenv').config();

const client = new Client ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

client.connect()
.then( () => {
    console.log("Connected to the database...");

}).catch( err => {
    console.error("Error connecting to the database:", err);

});

