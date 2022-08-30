const connection = require("../config/Database")
const nodemailer = require("nodemailer")

const getTask = function (app) {
  app.get("/api/getTask", (request, response) => {
    const { App_Acronym } = request.query
    const sqlGet = `SELECT *, DATE_FORMAT(Task_createDate, "%d/%m/%Y (%a) %H:%i") as createDate FROM task where Task_app_Acronym = ? order by Task_createDate desc`
    connection.query(sqlGet, [App_Acronym], (error, result) => {
      if (error) {
      } else if (result) {
        response.send(result)
      }
    })
  })

  app.get("/api/getTaskDetails/:Task_name", (request, response) => {
    const { Task_name } = request.params
    const sqlGetDetails = "select * from task WHERE Task_name = ?"
    connection.query(sqlGetDetails, [Task_name], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
      }
    })
  })

  app.get("/api/getAudit", (request, response) => {
    const Task_name = request.query.Task_name
    const sqlSelected = `select Task_name, Task_state, Task_auditTrail, Task_owner, DATE_FORMAT(Task_editTime, "%d/%m/%Y %H:%i:%s") as editDate from audit where Task_name = ? order by editDate Desc`
    connection.query(sqlSelected, [Task_name], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        const audit = []
        result.forEach(notes => {
          const auditNotes = `${notes.Task_name} \t ${notes.Task_state} \t ${notes.Task_owner} ${notes.editDate} \n ${notes.Task_auditTrail}  \n \n`
          audit.push(auditNotes)
        })
        response.send(audit)
      }
    })
  })

  app.post("/api/getTaskGroup", (request, response) => {
    const { username } = request.body
    const sqlGet = "SELECT usergroup FROM taskmanagement_db WHERE username = ?"
    connection.query(sqlGet, [username], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        let groupname = result[0].usergroup
        response.send(JSON.stringify({ groupname }))
      }
    })
  })

  app.put("/api/postState", (request, response) => {
    const { task_Name, newState, currentState, task_Owner, task_Creator } = request.body

    console.log(request.body)
    const sqlState = "update task set Task_state = ? where Task_name = ?"
    connection.query(sqlState, [newState, task_Name], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        let task_Notes = `state changed from ${currentState} to ${newState}`
        const sqlInsert = "insert into audit (Task_name, Task_state,  Task_auditTrail, Task_editTime, Task_owner) VALUES (?, ?, ?, now(), ?)"
        connection.query(sqlInsert, [task_Name, newState, task_Notes, task_Owner], (error, result) => {
          if (error) {
            console.log(error)
          } else {
            const sqlGetAudit = "update task set Task_owner = ? where Task_name = ?"
            connection.query(sqlGetAudit, [task_Owner, task_Name], (error, result) => {
              if (error) {
                console.log(error)
              } else {
                const sqlSelected = "select App_permit_Done, App_Acronym from application where App_Acronym = application.App_Acronym"
                connection.query(sqlSelected, (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                    if (newState === "Done") {
                      const sqlSelects = "select email from taskmanagement_db where username = ?"
                      connection.query(sqlSelects, [task_Owner], (error, results) => {
                        if (error) {
                          console.log(error)
                        } else {
                          const sqlSelection = "select email from taskmanagement_db where username = ?"
                          connection.query(sqlSelection, [task_Creator], (error, resulted) => {
                            if (error) {
                              console.log(error)
                            } else {
                              var transport = nodemailer.createTransport({
                                host: "smtp.mailtrap.io",
                                port: 2525,
                                auth: {
                                  user: "50d9b7f8a1a4c1",
                                  pass: "9c573491ed90f9"
                                }
                              })
                              transport.sendMail({
                                from: results[0].email,
                                to: resulted[0].email,
                                subject: "test email",
                                html: `<div className="email" style= "
                    border: 1px solid black; 
                    padding: 20px;
                    font-family: sans-serif;
                    line-height: 2;
                    font-size: 20px
                    ">
                    <h3> Task ${task_Name} has been successfully completed!</h3>
                    
                    <p>A task has successfully transitioned from Doing to Done! </p>
                    <p>Pending your approval~<p/>
                    </div>
                    `
                              })
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
        response.send(result)
      }
    })
  })

  app.post("/api/postTask", (request, response) => {
    const { isProjectLead, task_Owner, App_Acronym, Task_name, Task_description, task_Notes, task_State } = request.body
    let { task_Plan } = request.body
    let { task_CreateDate } = request.body
    const sqlData = "SELECT * FROM task WHERE Task_name = ?"
    connection.query(sqlData, [Task_name], (error, result) => {
      // console.log(result)
      if (result.length > 0) {
        console.log("Duplicate Task name!")
      }
      if (Task_name !== "") {
        if (task_Plan === "") {
          task_Plan = null
        }
        const sqlUser = "SELECT username FROM taskmanagement_db WHERE username = ?"
        connection.query(sqlUser, [isProjectLead], (error, result) => {
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
                connection.query(sqlInsert, [Task_name, Task_description, task_Notes, Task_id, task_Plan, App_Acronym, task_State, isProjectLead, task_Owner, task_CreateDate], (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                    response.send(result)
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
      }
    })
  })

  app.put("/api/updateTask/:Task_name", (request, response) => {
    const { Task_name, isProjectLead, App_Acronym, task_Desc, task_Notes, task_State, task_Owner } = request.body
    let { task_Plan } = request.body
    console.log("poke" + task_Plan)
    console.log(request.body)
    const sqlUser = "select username from taskmanagement_db where username = ?"
    connection.query(sqlUser, [isProjectLead], (error, result) => {
      if (error) {
        console.log(error)
      }
      if (task_Plan) {
        // task_Plan = null
        const sqlTask = "select App_Rnumber from application where App_Acronym = ?"
        connection.query(sqlTask, [App_Acronym], (error, result) => {
          if (error) {
            console.log(error)
          } else {
            let app_Rno = result[0].App_Rnumber
            const task_Id = `${App_Acronym}_${app_Rno}`
            const sqlUpdate = "UPDATE task SET Task_description = ?, Task_notes = ?, Task_id = ?, Task_plan = ?, Task_app_Acronym = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?"
            connection.query(sqlUpdate, [task_Desc, task_Notes, task_Id, task_Plan, App_Acronym, task_State, task_Owner, Task_name], (error, result) => {
              if (error) {
                console.log(error)
              } else {
                const sqlInsert = "insert into audit (Task_name, Task_state,  Task_auditTrail, Task_editTime, Task_owner) VALUES (?, ?, ?, now(), ?)"
                connection.query(sqlInsert, [Task_name, task_State, task_Notes, task_Owner], (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                  }
                })
              }
            })
          }
          response.send(result)
        })
      } else {
        const sqlTask = "select App_Rnumber from application where App_Acronym = ?"
        connection.query(sqlTask, [App_Acronym], (error, result) => {
          if (error) {
            console.log(error)
          } else {
            let app_Rno = result[0].App_Rnumber
            const task_Id = `${App_Acronym}_${app_Rno}`
            const sqlUpdate = "UPDATE task SET Task_description = ?, Task_notes = ?, Task_id = ?, Task_app_Acronym = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?"
            connection.query(sqlUpdate, [task_Desc, task_Notes, task_Id, App_Acronym, task_State, task_Owner, Task_name], (error, result) => {
              if (error) {
                console.log(error)
              } else {
                const sqlInsert = "insert into audit (Task_name, Task_state,  Task_auditTrail, Task_editTime, Task_owner) VALUES (?, ?, ?, now(), ?)"
                connection.query(sqlInsert, [Task_name, task_State, task_Notes, task_Owner], (error, result) => {
                  if (error) {
                    console.log(error)
                  } else {
                  }
                })
              }
            })
          }
          response.send(result)
        })
      }
    })
  })
}

module.exports = getTask
