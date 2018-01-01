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
let forbidden = null;

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
  forbidden = db.collection("forbidden");

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

async function listAbbreviationsFromCollection(collection, req, res) {
  let list = await collection.find({}).toArray();
  list = list.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  res.json(list);
}

async function addAbbreviationToCollection(collection, obj, res) {
  const { abbreviation } = obj;
  const existingAbbreviation = abbreviations.findOne({ abbreviation });
  if (existingAbbreviation) return res.status(400).json({ response: `Abbreviation ${abbreviation} already exists.` });
  await abbreviations.insertOne(obj);
  res.status(200).json({ response: "Success" });
}

async function deleteAbbreviationFromCollection(collection, req, res) {
  const { id, abbreviation } = req.body;
  const existingAbbreviation = abbreviations.findOne({ id });
  if (!existingAbbreviation) return res.status(200).json({ response: "Success" });
  await collection.deleteOne({ id });
  res.status(400).json({ response: `Abbreviation ${abbreviation} does not exist.` });
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
  if (!user) res.status(400).json({ response: "Invalid login" });
  else res.json(user);
});

/*
 * Get list of abbreviations
 */
router.get("/abbreviations", (req, res) => {
  listAbbreviationsFromCollection(abbreviations, req, res);
});

/*
 * Add an abbreviation
 */
router.post("/abbreviations/add", (req, res) => {
  const { abbreviation, description, notes } = req.body;
  addAbbreviationToCollection(abbreviations, { abbreviation, description, notes }, res);
});

/*
 * Delete an abbreviation
 */
router.post("/abbreviations/delete", (req, res) => {
  deleteAbbreviationFromCollection(abbreviations, req, res);
});

/*
 * Get list of forbidden abbreviations
 */
router.get("/forbidden", (req, res) => {
  listAbbreviationsFromCollection(forbidden, req, res);
});

/*
 * Add a forbidden abbreviation
 */
router.post("/forbidden/add", (req, res) => {
  const { abbreviation, intendedMeaning, comments, correctUsage } = req.body;
  addAbbreviationToCollection(forbidden, { abbreviation, intendedMeaning, comments, correctUsage }, res);
});

/*
 * Delete a forbidden abbreviation
 */
router.post("/abbreviations/delete", (req, res) => {
  deleteAbbreviationFromCollection(forbidden, req, res);
});
