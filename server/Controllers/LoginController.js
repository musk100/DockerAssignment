const connection = require("../config/Database")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")

const AddController = require("./AddController")

const login = async function (app) {
  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))

  /*get the data of User input on login page and validate if account is active or inactive */
  app.post("/login", (request, response) => {
    //login user
    const username = request.body.username
    const password = request.body.password
    const sqlQuery = "SELECT status, password FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlQuery, [username], async (error, result) => {
      if (error) {
        console.log(error)
        return
      }
      if (!result.length) {
        console.log("Invalid Credentials")
        response.send({ login: false })
        return
      }
      console.log(result[0].status)
      const isValid = await bcrypt.compare(password, result[0].password)
      //password matched
      if (isValid && result[0].status === "active") {
        response.send({ login: true, username: username })
        console.log("Successful login!")
        console.log("Authorized Account")
      } else {
        console.log("Invalid Credentials!")
        response.send({ login: false })
      }
    })
  })
}
AddController(app)
module.exports = login
