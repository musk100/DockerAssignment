const connection = require("../config/Database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

const TaskStateAPI = function (app) {
  app.get("/api/get-task-by-state", async (request, response) => {
    try {
      let jsonData = request.body
      let getTaskByStateInfo = {}

       // setting JSON keys to lower case
       for (let key in jsonData) {
        getTaskByStateInfo[key.toLowerCase()] = jsonData[key]
      }

      let Task_state = getTaskByStateInfo.task_state
      const Login = await login(getTaskByStateInfo)

       // if user is authenticated (success)
       if (Login.code === 200) {
        console.log("login")
        try {
          // check Task state (success)
          const success = await gettaskbystate(Task_state)

          if (success.code === 200) {
            console.log("task state")
            response.send(success)
          }
        } catch (error) {
          // check Task state (fail)
          response.send(error)
        }
       }
    } catch (error) {
      // Login error
      response.send(error)
    }
  })
}

// Login (PROMISE)
function login(jsonData) {
  return new Promise((resolve, reject) => {
    if (!jsonData.hasOwnProperty("username") || !jsonData.hasOwnProperty("password") || !jsonData.hasOwnProperty("task_state")) {
      return reject({ code: 4008 })
    }z
    let username = jsonData.username
    let password = jsonData.password
    let email = ""
    let status = ""
    let usergroup = ""

    // login validation
    username = strip(username)
    password = strip(password)

    // check username for empty field
    if (validator.isEmpty(username)) {
      return reject({ code: 4006 })
    }

     // check username (whitespace)
     if (!checkUsernameFormat(username)) {
      return reject({ code: 4005 })
    }

    // check password (empty field)
    if (validator.isEmpty(password)) {
      return reject({ code: 4006 })
    }

    if (username && password) {
      const checkLogin = `SELECT email, password, usergroup, status FROM taskmanagement_db WHERE username = ?`
      connection.query(checkLogin, [username], function (error, rows) {
        if (error) reject(error)

        if (rows.length > 0) {
          const passwordCheck = bcrypt.compareSync(password, rows[0].password)

          // if valid password (match hash password  in database)
          if (passwordCheck) {
            const checkUser = `SELECT username, password, email, usergroup, status FROM taskmanagement_db WHERE taskmanagement_db.username = ?`

            connection.query(checkUser, [username], function (error, rows) {
              if (error) reject(error)

              if (rows.length > 0) {
                // get user details from database
                email = rows[0].email
                status = rows[0].status
                usergroup = rows[0].usergroup

                //check if user is inactive (deny login)
                if (status == "inactive") {
                  return reject({ code: 4002 })
                }
                // if user is active (approve login)
                else if (status == "active") {
                  const userInfo = {
                    username: username,
                    email: email,
                    status: status,
                    usergroup: usergroup
                  }

                  return resolve({ code: 200 })
                }
              } else {
                return reject({ code: 4001 })
              }
            })
          } else {
            return reject({ code: 4001 })
          }
        } else {
          return reject({ code: 4001 })
        }
      })
    }
  })
}

  // Get task by promise 
  function gettaskbystate(Task_state) {
    return new Promise((resolve, reject) => {
      // check for empty state
      if (validator.isEmpty(Task_state)) {
        return reject({ message: "Task state is mandatory but it contains an empty field", code: 4006 })
      }

      // check for invalid task state
      if (
        Task_state.toLowerCase() === "open" ||
        Task_state.toLowerCase() === "to do" ||
        Task_state.toLowerCase() === "doing" ||
        Task_state.toLowerCase() === "done" ||
        Task_state.toLowerCase() === "close"
      ) {
        const getTask = `SELECT * FROM task WHERE LOWER( Task_state ) = ?`
        connection.query(getTask, [Task_state.toLowerCase()], function (err, result) {
          if (err) reject (err)
          
          //if there are tasks
          if (result.length > 0) {
            return resolve({ code: 200, data: result })
          }
          // if there are no tasks
          else {
            return resolve({ code: 200, data: [] })
          }
        })
      }
      // if invalid task state
      else {
        return reject({ code: 4005 })
      }
    })
  }


module.exports = TaskStateAPI