const connection = require("../config/Database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")
const checkGroup = require("../Controllers/GroupCheck")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

const CreatedTaskAPI = function (app) {
  app.post("/api/create-new-task", async (request, response) => {
    try {
      let jsonData = request.body
      const {task_Owner, App_Acronym, Task_name, task_Notes, Task_description} = request.body
      let createTaskInfo = {}
      let Task_plan = ""
      let task_State = "Open"
      let { task_CreateDate } = request.body

      // setting JSON keys to lower case
      for (let key in jsonData) {
        createTaskInfo[key.toLowerCase()] = jsonData[key]
      }

      let username = createTaskInfo.username
      let Task_app_Acronym = createTaskInfo.app_acronym
      const Login = await login(createTaskInfo)

      // if user is authenticated (success)
      if (Login.code === 200) {
        console.log("login")
        try {
          const PermitCreate = await checkAppPermitCreate(Task_app_Acronym)
          console.log(PermitCreate.permitCreate)

          if (PermitCreate.code === 200) {
            try {
              let permitcreate = PermitCreate.permitCreate
              const checkUserGroup = await checkGroup(username, permitcreate)
              console.log(checkUserGroup)
              if (checkUserGroup) {
                const sqlData = "SELECT * FROM task WHERE Task_name = ?"
                connection.query(sqlData, [Task_name], (error, result) => {
                  // console.log(result)
                  if (result.length > 0) {
                    console.log("Duplicate Task name!")
                    response.send({ code: 4003 })
                  }
                  if (Task_name) {
                    if (Task_plan === "") {
                      Task_plan = null
                    }
                    const sqlUser = `SELECT username FROM taskmanagement_db WHERE username = ? AND usergroup = "project lead"`
                    connection.query(sqlUser, [username], (error, result) => {
                      if (error) {
                        console.log(error)
                      } else {
                        const sqlTask = "SELECT App_Rnumber FROM application WHERE App_Acronym = ?"
                        connection.query(sqlTask, [App_Acronym], (error, result) => {
                          if (error) {
                            console.log(error)
                          } else {
                            let app_Rno = result[0].App_Rnumber + 1
                            const Task_id = `${App_Acronym}_${app_Rno}`
                            const sqlInsert = "INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())"
                            connection.query(sqlInsert, [Task_name, Task_description, task_Notes, Task_id, Task_plan, App_Acronym, task_State, username, username, task_CreateDate], (error, result) => {
                              if (error) {
                              } else {
                                response.send({ code: 200, Task_id })
                                const sqlUpdate = "UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?"
                                connection.query(sqlUpdate, [app_Rno, App_Acronym], (error, result) => {
                                  if (error) {
                                    console.log(error)
                                  } else {
                                    console.log(result)
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  } else {
                    console.log("Required fields empty")
                    response.send({ message: "Mandatory input field empty", code: 4006 })
                  }
                })
              }
            } catch (error) {
              response.send(error)
            }
          }
        } catch (error) {
          response.send(error)
        }
      }
    } catch (error) {
      response.send(error)
    }
  })
}

// Login (PROMISE)
function login(jsonData) {
  return new Promise((resolve, reject) => {
    if (!jsonData.hasOwnProperty("username") || !jsonData.hasOwnProperty("password") || !jsonData.hasOwnProperty("task_name") || !jsonData.hasOwnProperty("task_description") || !jsonData.hasOwnProperty("app_acronym")) {
      return reject({ code: 4008 })
    }
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
                  return reject({ message: "Permission Denied", code: 4002 })
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

// Check App Permit Create (Promise)
function checkAppPermitCreate(application) {
  return new Promise((resolve, reject) => {
    // check empty task app acronym
    if (validator.isEmpty(application)) {
      return reject({ code: 4006 })
    }

    let permitCreate = ""
    const appPermitCreate = `SELECT * FROM application WHERE App_Acronym = ?`
    connection.query(appPermitCreate, [application], function (error, rows) {
      if (error) reject(error)
      if (rows.length > 0) {
        permitCreate = rows[0].App_permit_Create
        return resolve({ code: 200, permitCreate: permitCreate })
      } else {
        return reject({ code: 4005 })
      }
    })
  })
}

module.exports = CreatedTaskAPI
