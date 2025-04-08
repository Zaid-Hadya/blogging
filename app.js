const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database...");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(express.json());

const posts = [];

app.get("/posts", async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM blog ORDER BY id ASC`);

    res.status(201).json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Some error has occurred");
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(`SELECT * FROM blog WHERE id = $1;`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("this post is not in the database");
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Some error has occurred");
  }
});

app.post("/posts", async (req, res) => {
  const { author, title, published_date } = req.body;

  if (!author || !title || !published_date) {
    return res.status(400).send("One of the entries is missing");
  }

  try {
    const result = await client.query(
      `INSERT INTO blog (author, title, published_date) VALUES ($1, $2, $3) RETURNING id;`,
      [author, title, published_date]
    );

    // Respond with the newly added post's ID
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Some error has occurred");
  }
});

app.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, published_date } = req.body;

  try {
    const query = `
    UPDATE blog SET author = $1, title = $2, published_date = $3 WHERE id = $4 RETURNING *
    `;
    const values = [author, title, published_date, id];

    const result = await client.query(query, values);
    res.status(200).send({ message: "Updated" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Not Found", err });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, title, published_date } = req.body;

    if (!title && !artist && !price) {
      return res.status(400).send("provide a field (title, artist, or price)");
    }

    const query = `
  UPDATE blog SET author = $1, title = $2, published_date = $3 WHERE id = $4 RETURNING *
  `;
    const values = [author, title, published_date, id];

    const result = await client.query(query, values);
    res.status(200).send({ message: "Updated" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Not Found", err });
  }
});

app.delete("/posts/:id", (req, res) => {
  if (posts.params != undefined) {
    posts.splice(posts.params);
    res.status(201).send("Post has been deleted");
    return;
  }
  res.status(400).send("The post doesnt exist!");
});

app.listen(port, () => {
  console.log(`The app is listening on port: ${port}`);
});
