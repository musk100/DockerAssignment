const connection = require("../config/Database")

function checkGroup(username, groupname) {
  return new Promise((resolve, reject) => {
    const sqlGet = "SELECT * FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlGet, [username], (error, result) => {
      if (error) reject(err)

      if (result.length > 0) {
        if (result[0].usergroup.includes(groupname)) {
          return resolve(true)
        }
      }
      return reject({ code: 4002 })
    })
  })
}

module.exports = checkGroup
