/* * * * * * * * *
 * Dependencies  *
 * * * * * * * * */
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const slash = require("express-slash"); // Middleware to enforce trailing slashes, important for serving projects

/* * * * * * * * * * * * *
 * Express Server Setup  *
 * * * * * * * * * * * * */
const app = express();
const jsonParser = bodyParser.json();

app.enable("strict routing");
app.use(express.static("public"));
app.use(jsonParser);
app.use(cors({ origin: /https?:\/\/(.*\.kfshrc-abbreviations\.herokuapp\.com|localhost)(:[0-9]+)?/i, credentials: true }));

const router = express.Router({
  strict: app.get("strict routing")
});

app.use(router);
app.use(slash());

/* * * * * * * * *
 * MongoDB Setup *
 * * * * * * * * */
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
let db = null;
let users = null;
let abbreviations = null;

/* * * * * * * * *
 * Start Server  *
 * * * * * * * * */
async function main() {
  const DATABASE_NAME = "abbreviations-db";
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  users = db.collection("users");
  abbreviations = db.collection("abbreviations");

  // The "process.env.PORT" is needed to work with Heroku.
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server listening on port ${port}!`);
}

main();

////////////////////////////////////////////////////////////////////////////////

/* * * * * * * * * * *
 * Helper Functions  *
 * * * * * * * * * * */
async function authorized(req) {
  const username = req.params.username || req.body.username;
  return req.userInfo && username === req.userInfo.email;
}

function caseInsensitive(phrase) {
  return {
    $regex: new RegExp(phrase, "i")
  };
}

/* * * * * * * *
 * API Routes  *
 * * * * * * * */

/*
 * Get a user object.
 */
router.post("/users/signin", async function(req, res) {
  if (!req.body.username || !req.body.password) return res.status(400).json({response: "Invalid user information."});
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  let user = await users.findOne({ username, password });
  if (!user) res.status(400).json({response: "Invalid login"});
  else res.json(user);
});

/*
 * Get list of abbreviations
 */
router.get("/list", async function(req, res) {
  let list = await abbreviations.find({}).toArray();
  list = list.sort((a, b) => {
    return a.abbreviation.localeCompare(b.abbreviation);
  });
  res.json(list);
});
