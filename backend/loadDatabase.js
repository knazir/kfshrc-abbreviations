const fs = require("fs");
const csv = require("csvtojson");
const csvLength = 1973;

/* * * * * * * * * * * * * * * * * * * * * * *
 * Creates Database and Loads Initial Items  *
 * * * * * * * * * * * * * * * * * * * * * * */
async function loadAbbreviations(users, abbreviations) {
  await users.insertOne({ username: "kashif", password: "tomato" });
  const list = [];
  csv().fromFile("res/abbreviations.csv")
    .on("json", async obj => list.push(obj))
    .on("done", async err => {
      await Promise.all(list.map(obj => abbreviations.insertOne(obj)));
      process.stdout.write("Done.\n");
      process.exit();
    });
}

async function main() {
  const MongoClient = require("mongodb").MongoClient;
  const ObjectID = require("mongodb").ObjectID;

  const DATABASE_NAME = "abbreviations-db";
  const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

  // The "process.env.MONGODB_URI" is needed to work with Heroku.

  process.stdout.write("Connecting to MongoDB... ");
  db = await MongoClient.connect(process.env.MONGODB_URI || MONGO_URL);
  process.stdout.write("Done.\n");

  process.stdout.write("Dropping database... ");
  db.dropDatabase();
  process.stdout.write("Done.\n");

  process.stdout.write("Creating Users collection... ");
  await db.createCollection("users");
  process.stdout.write("Done.\n");

  process.stdout.write("Creating Abbreviations collection... ");
  await db.createCollection("abbreviations");
  process.stdout.write("Done.\n");

  const users = db.collection("users");
  const abbreviations = db.collection("abbreviations");

  process.stdout.write("Loading abbreviations from CSV... ");
  await loadAbbreviations(users, abbreviations);
}

main();