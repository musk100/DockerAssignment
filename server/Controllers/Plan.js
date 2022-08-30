const connection = require("../config/Database")

const getPlan = function (app) {
  app.get("/api/getPlan", (request, response) => {
    const { App_Acronym } = request.query
    const sqlGet = `SELECT *, DATE_FORMAT(Plan_startDate, "%d/%m/%Y (%a)") as startDate,  DATE_FORMAT(Plan_endDate, "%d/%m/%Y (%a)") as endDate from plan where Plan_app_Acronym = ?`
    connection.query(sqlGet, [App_Acronym], (error, result) => {
      if (error) throw error
      else if (result) {
        response.send(result)
      }
    })
  })

  app.get("/api/getPlans", (request, response) => {
    const sqlGet = "SELECT * from plan" 
    connection.query(sqlGet, (error, result) => {
      if (error) throw error
      else if (result) {
        response.send(result)
      }
    })
  })

  app.post("/api/postPlan", (request, response) => {
    const { plan_Name} = request.body
    const {plan_app_Acronym} = request.body
    let { plan_Start } = request.body
    let { plan_End } = request.body
    console.log(request.body)
    const sqlData = "SELECT * FROM plan WHERE Plan_MVP_name = ?"
    connection.query(sqlData, [plan_Name], function (error, result) {
      console.log(result)
      if (result.length > 0) {
        response.send(false)
        console.log("Duplicate Plan Name!")
      }
      if (plan_Name && plan_Start && plan_End && plan_app_Acronym !== "" ) {
        const sqlInsert = "INSERT INTO plan (Plan_MVP_name, Plan_startDate,  Plan_endDate, Plan_app_Acronym) VALUES (?, ?, ?, ?)" 
        connection.query(sqlInsert, [plan_Name, plan_Start, plan_End, plan_app_Acronym], function (error, result) {
          if (error) {
            console.log(error)
          } else {
            response.send(true) 
          }
        })
      } else {
        console.log("Required fields are empty!")
      }
    })
  })
}

module.exports = getPlan
