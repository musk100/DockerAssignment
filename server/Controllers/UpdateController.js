const connection = require("../config/Database")
const bcrypt = require("bcrypt")
const saltRounds = 4

const update = function (app) {
  /*Get all data from taskmanagement_db database and load on table to edit*/
  app.get("/api/get/:username", (request, response) => {
    const { username } = request.params
    const sqlGet = "SELECT * FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlGet, [username], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
      }
    })
  })

  /* Update Users email and status in admin account*/
  app.put("/api/update/:username", (request, response) => {
    const { username } = request.params
    const { email, usergroup, status } = request.body
    console.log(request.body)
    const groupStr = usergroup.toString()
    const sqlUpdate = "UPDATE taskmanagement_db SET email = ?, usergroup = ?, status = ? WHERE username = ?"
    connection.query(sqlUpdate, [email, groupStr, status, username], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        console.log(groupStr.split(","))
        usergroup.forEach(key => {
          console.log(key)
          console.log(username)
          const sqlInsert = "INSERT INTO usergroups (username, usergroup) VALUES (?, ?)"
          connection.query(sqlInsert, [username, key], (error, result) => {
            if (error) {
              console.log(error)
            } else {
              response.send(result)
            }
          })
        })
      }
      console.log("Update Success!")
    })
  })
  /*Update/Reset users password in admin account*/
  app.put("/api/updated/:username", (request, response) => {
    const { username, password } = request.body
    console.log(request.body)
    const sqlInput = "SELECT username FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlInput, [username], (error, result) => {
      if (result.length < 0) {
        console.log("User not found")
      }
    })
    const sqlUpdate = "UPDATE taskmanagement_db SET password = ? WHERE username = ?"
    bcrypt.hash(password, saltRounds, function (err, hash) {
      connection.query(sqlUpdate, [hash, username], (error, result) => {
        if (error) {
          console.log(error)
        }
      })
    })
  })
  /*update email in non-admin account*/
  app.put("/api/updates/:username", (request, response) => {
    const { username } = request.params
    const { email } = request.body
    console.log(request.body)
    const sqlUpdate = "UPDATE taskmanagement_db SET email = ? WHERE username = ?"
    connection.query(sqlUpdate, [email, username], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
        console.log("Update Success!")
      }
    })
  })
}

module.exports = update
