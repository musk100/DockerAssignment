const connection = require("../config/Database")

/*Check group of username to determine if user is admin*/
const Checkgroup = function (app) {
  app.get("/api/getGroup", (request, response) => {
    const { username } = request.query
    const sqlGet = "SELECT usergroup FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlGet, [username], (error, result) => {
      if (error) {
        console.log(error)
      }
     else {
      let groupname = result[0].usergroup
      response.send(JSON.stringify({ groupname }))
      }
    })
  })

  /*To get data of user in what group from taskmanagement_db database and display in table*/
  app.get("/api/getGroupname", (request, response) => {
    const sqlGet = "Select usergroup, username FROM taskmanagement_db"
    connection.query(sqlGet, (error, result) => {
      if (error) throw error
      else if (result) {
        console.log(result)
      }
    })
  })

  /*To get all User Groups from database and load into dropdown list*/
  app.get("/api/getGrouping", (request, response) => {
    const sqlGet = "Select * FROM groupname"
    connection.query(sqlGet, (error, result) => {
      if (error) throw error
      else if (result) {
        response.send(result)
      }
    })
  })
}

module.exports = Checkgroup
