const connection = require("../config/Database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")
const nodemailer = require("nodemailer")
const checkGroup = require("../Controllers/GroupCheck")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

const PromoteTaskAPI = function (app) {
  app.post("/api/promote-task-to-done", async (request, response) => {
    try {
      //declare variables for login and createtask
      let jsonData = request.body
      let promoteTaskToDoneInfo = {}

      // setting JSON keys to lower case
      for (let key in jsonData) {
        promoteTaskToDoneInfo[key.toLowerCase()] = jsonData[key]
      }

      let username = promoteTaskToDoneInfo.username
      let Task_name = promoteTaskToDoneInfo.task_name
      let newState = "Done"
      let currentState = "Doing"
      let taskOwnerEmail = ""
      let email = ""
      let usergroup = ""

      // call all required promises (login/checkgroup/promotetask)
      const Login = await login(promoteTaskToDoneInfo)

      //Login if user is authenticated (success)
      if (Login.code === 200) {
        console.log("login")
        try {
          const PermitDoing = await checkAppPermitDoing(Task_name)
          console.log(PermitDoing.permitDoing)
          // Check App Permit Doing: if user is in app permit doing (success)
          if (PermitDoing.code === 200) {
            try {
              let permitdoing = PermitDoing.permitDoing
              const checkUserGroup = await checkGroup(username, permitdoing)
              console.log(checkUserGroup)
              if (checkUserGroup) {
                const sqlState = "update task set Task_state = ? where Task_name = ?"
                connection.query(sqlState, [newState, Task_name], (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                    let task_Notes = `state changed from ${currentState} to ${newState}`
                    const sqlInsert = "insert into audit (Task_name, Task_state,  Task_auditTrail, Task_editTime, Task_owner) VALUES (?, ?, ?, now(), ?)"
                    connection.query(sqlInsert, [Task_name, newState, task_Notes, username], (error, result) => {
                      if (error) {
                        console.log(error)
                      } else {
                        const sqlGetAudit = "update task set Task_owner = ? where Task_name = ?"
                        connection.query(sqlGetAudit, [username, Task_name], (error, result) => {
                          if (error) {
                            console.log(error)
                          } else {
                            response.send({ code: 200 })
                            const sqlSelected = "select App_permit_Done, App_Acronym from application where App_Acronym = application.App_Acronym"
                            connection.query(sqlSelected, (error, result) => {
                              if (error) {
                                console.log(error)
                              } else {
                                if (newState === "Done") {
                                  const sqlSelects = "select email from taskmanagement_db where username = ?"
                                  connection.query(sqlSelects, [username], (error, results) => {
                                    if (error) {
                                      console.log(error)
                                    } else {
                                      taskOwnerEmail = results[0].email
                                      const getAccountEmail = `select * from taskmanagement_db`

                                      connection.query(getAccountEmail, function (err, rows) {
                                        if (err) reject(err)
                                        if (rows.length > 0) {
                                          for (var i = 0; i < rows.length; i++) {
                                            email = rows[i].email
                                            usergroup = rows[i].usergroup.includes("project lead")

                                            if (usergroup) {
                                              var transport = nodemailer.createTransport({
                                                host: "smtp.mailtrap.io",
                                                port: 2525,
                                                auth: {
                                                  user: "50d9b7f8a1a4c1",
                                                  pass: "9c573491ed90f9"
                                                }
                                              })

                                              transport.sendMail({
                                                from: taskOwnerEmail,
                                                to: email,
                                                subject: "TMS Task Notification",
                                                html: `<div className="email" style= "
                                                        border: 1px solid black;
                                                        padding: 20px;
                                                        font-family: sans-serif;
                                                        line-height: 2;
                                                        font-size: 20px
                                                        ">
                                                        <h3> Task ${Task_name} has been successfully completed!</h3>

                                                        <p>A task has successfully transitioned from Doing to Done! </p>
                                                        <p>Pending your approval~<p/>
                                                        </div>
                                                        `
                                              })
                                            }
                                          }
                                        }
                                      })
                                    }
                                  })
                                  console.log("email sent")
                                }
                              }
                            })
                          }
                        })
                      }
                    })
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
    if (!jsonData.hasOwnProperty("username") || !jsonData.hasOwnProperty("password") || !jsonData.hasOwnProperty("task_name")) {
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

// Check App Permit Doing (PROMISE)
function checkAppPermitDoing(task) {
  return new Promise((resolve, reject) => {
    // check empty task app acronym
    if (validator.isEmpty(task)) {
      return reject({ code: 4006 })
    }
    let Task_state = ""
    let Task_app_Acronym = ""
    let permitDoing = ""
    const getTaskApp = `SELECT * FROM task WHERE Task_name = ?`
    connection.query(getTaskApp, [task], function (err, rows) {
      if (err) reject(err)
      if (rows.length > 0) {
        Task_state = rows[0].Task_state
        Task_app_Acronym = rows[0].Task_app_Acronym
        if (Task_state.toLowerCase() === "open" || Task_state.toLowerCase() === "to do" || Task_state.toLowerCase() === "done" || Task_state.toLowerCase() === "close") {
          return reject({ code: 4007 })
        }
        const appPermitDoing = `SELECT *
                                FROM application
                                WHERE App_Acronym = ?`

        connection.query(appPermitDoing, [Task_app_Acronym], function (err, rows) {
          if (err) reject(err)
          if (rows.length > 0) {
            permitDoing = rows[0].App_permit_Doing
            return resolve({ code: 200, permitDoing: permitDoing })
          } else {
            return reject({ code: 4005 })
          }
        })
      } else {
        return reject({ code: 4005 })
      }
    })
  })
}

module.exports = PromoteTaskAPI
