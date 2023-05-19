import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

// The MongoClient is the object that references the connection to our
// datastore (Atlas, for example)
const client = new MongoClient(connectionString);

// The connect() method does not attempt a connection; instead it instructs
// the driver to connect using the settings provided when a connection
// is required.
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

// Provide the name of the database.
// If the database does not exist, the driver and Atlas
// will create them automatically when you first write data.
const dbName = "ChangeX";

// Create references to the database in order to run
// operations on them.
const database = conn.db(dbName);

export default database;