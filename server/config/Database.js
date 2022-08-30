const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gracielo",
  database: "assignment"
})

module.exports = connection
