const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.CONNECTIONSTRING);

async function start() {
  try {
    await client.connect();
    console.log("Database connected successfully!");
    module.exports = client;

    // Start the server
    const app = require("./server");
    app.listen(process.env.PORT, () => {
      console.log(`Server is live on port:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
}

start();