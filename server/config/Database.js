const mysql = require("mysql")
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.SERVER_HOST,
  user: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD,
  database: process.env.SERVER_DATABASE,
  port: process.env.SERVER_PORT
})

module.exports = connection
