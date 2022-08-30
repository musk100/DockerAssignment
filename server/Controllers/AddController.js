const connection = require("../config/Database")
//how much time is needed to calculate a single BCrypt hash.
//The higher the 'saltRound', the more hashing rounds are done
//increasing the 'saltRound' by 1 doubles the necessary time
//the more time necessary, the more difficult brute-forcing decoding
const saltRounds = 10
//hashing password
const bcrypt = require("bcrypt")

const Add = function (app) {
  app.get("/api/get", (request, response) => {
    const sqlGet = "SELECT * FROM taskmanagement_db"
    connection.query(sqlGet, (error, result) => {
      response.send(result)
    })
  })
  
  app.post("/api/post", (request, response) => {
    const { username, email, password, usergroup, status } = request.body
    const sqlData = "SELECT username FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlData, [username], function (error, result) {
      console.log(result)
      if (result.length > 0) {
        response.send(false)
        console.log("Duplicate User")
      } else {
        const groupStr = usergroup.toString()
        bcrypt.hash(password, saltRounds, function (err, hash) {
          const sqlInsert = "INSERT INTO taskmanagement_db (username, email, password, usergroup, status) VALUES ?"
          const values = [[username, email, hash, groupStr, status]]
          connection.query(sqlInsert, [values], function (error, result) {
            if (error) {
              console.log(error.errno)
            } else {
              console.log(groupStr.split(","))
              usergroup.forEach(key => {
                console.log(key)
                const sqlUpdate = "INSERT INTO usergroups (username, usergroup) VALUES (?, ?)"
                connection.query(sqlUpdate, [username, key], (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                    console.log(result)
                  }
                })
              })
              response.send({
                message: "Table Data",
                result: result
              })
            }
          })
        })
      }
    })
  })

  //Check database to find if user is a duplicate
  app.get("/api/getDuplicate", (request, response) => {
    const username = request.body
    const sqlData = "SELECT username FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlData, [username], (error, result) => {
      if (error) throw error
      else {
        console.log(result)
        response.send(result)
      }
    })
  })
}

module.exports = Add
