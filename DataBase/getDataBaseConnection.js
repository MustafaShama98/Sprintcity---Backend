const  Pool  = require("pg-pool");
require("dotenv").config({path:'../.env'});


const pool = new Pool({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.DBdatabase,
  password: process.env.DBpassword,
  port: process.env.DBport,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function getConnection() {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error("Error acquiring a PostgreSQL client:", error);
    throw error;
  }
}



pool.on("connect", (client) => {
  console.log("Connection acquired from the pool");
});

pool.on("remove", (client) => {
  console.log("Connection released back to the pool");
});

module.exports = getConnection;
