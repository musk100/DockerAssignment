const connection = require("../config/Database")

const getApplication = function (app) {
  app.get("/api/getApplication", (request, response) => {
    const sqlGet = "SELECT * FROM application"
    connection.query(sqlGet, (error, result) => {
      if (error) throw error
      else if (result) {
        response.send(result)
      }
    })
  })

  app.get("/api/getApplicationDetails", (request, response) => {
    const sqlGets = `SELECT *, DATE_FORMAT(App_startDate, "%Y-%m-%d") as startDate, DATE_FORMAT(App_endDate, "%Y-%m-%d") as endDate  FROM application`
    connection.query(sqlGets, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
      }
    })
  })


  app.get("/api/getApplicationDetails/:App_Acronym", (request, response) => {
    const { App_Acronym } = request.params
    const sqlGets = `SELECT *, DATE_FORMAT(App_startDate, "%Y-%m-%d") as startDate, DATE_FORMAT(App_endDate, "%Y-%m-%d") as endDate  FROM application WHERE App_Acronym = ?`
    connection.query(sqlGets, [App_Acronym], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
      }
    })
  })

  app.post("/api/postApplication", (request, response) => {
    const { app_Acronym, app_Desc, app_Rno, app_Create, app_Open, app_ToDo, app_Doing, app_Done } = request.body
    let { app_Start } = request.body
    let { app_End } = request.body
    console.log(request.body)
    const sqlData = "SELECT * FROM application WHERE App_Acronym = ?"
    connection.query(sqlData, [app_Acronym], function (error, result) {
      console.log(result)
      if (result.length > 0) {
        response.send(false)
        console.log("Duplicate App Acronym!")
      }
      if (app_Acronym && app_Desc && app_Rno !== "") {
        if (app_Start === "") {
          app_Start = null
        }
        if (app_End === "") {
          app_End = null
        }
        const sqlInsert = "INSERT INTO application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Create, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        connection.query(sqlInsert, [app_Acronym, app_Desc, app_Rno, app_Start, app_End, app_Create, app_Open, app_ToDo, app_Doing, app_Done], function (error, result) {
          if (error) {
            console.log(error)
          } else {
            response.send(true)
            console.log(result)
          }
        })
      } else {
        console.log("Required fields are empty!")
      }
    })
  })

  app.put("/api/updateApplication/:App_Acronym", (request, response) => {
    const {App_Acronym } = request.params
    const { app_Desc, app_Rno, app_Create, app_Open, app_ToDo, app_Doing, app_Done } = request.body
    let { app_Start } = request.body
    let { app_End } = request.body
    const sqlUpdate = "UPDATE application SET App_Description = ?, App_Rnumber = ?, App_startDate = ?, App_endDate = ?, App_permit_Create = ?, App_permit_Open = ?, App_permit_toDoList = ?, App_permit_Doing = ?, App_permit_Done = ? WHERE App_Acronym = ?"
    connection.query(sqlUpdate, [app_Desc, app_Rno, app_Start, app_End, app_Create, app_Open, app_ToDo, app_Doing, app_Done, App_Acronym], (error, result) => {
      if (error) {
        console.log(error)
      } else {
        response.send(result)
      }
    })
  })
}

module.exports = getApplication
