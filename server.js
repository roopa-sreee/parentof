const express = require("express");

const path = require("path");

const { open } = require("sqlite");
const { sqlite3 } = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "parentof.db");

let db = null;

const connectDBToServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server is Running at port 5000");
    });
  } catch (error) {
    console.log(`error from database : ${error.message}`);
    process.exit(1);
  }
};

connectDBToServer();

app.get("/", async (req, res) => {
  res.send("Hello world!  \n Welcome to my new project");
});

app.get("/users", async (req, res) => {
  const usersQuery = `
    SELECT * FROM users; `;

  const users = await db.all(usersQuery);
  res.status(200).send({
    success: true,
    users,
  });
});

app.post("/users", async (req, res) => {
  const userDetails = req.body;
  const { name, place } = userDetails;

  const postUser = `
       INSERT INTO users(name,place) VALUES(${name}, ${place});
    `;

  const response = await db.run(postUser);
  const userId = response.lastID;
  res.status(200).send({
    success: true,
    message: "user created successfully",
    userId,
  });
});
