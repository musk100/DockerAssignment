const express = require("express")
const app = express()
const cors = require("cors")

const AddController = require("./Controllers/AddController")
const CheckGroupController = require("./Controllers/CheckGroupController")
const LoginController = require("./Controllers/LoginController")
const UpdateController = require("./Controllers/UpdateController")
const AddGroupController = require("./Controllers/AddGroupController")
const GetApplication = require("./Controllers/GetApplication")
const GetPlan = require("./Controllers/Plan")
const GetTask = require("./Controllers/Task")

/* ASSIGNMENT 3 */
const CreatedTaskAPI = require("./restAPI/CreatedTask")
const TaskStateAPI = require("./restAPI/GetTaskbyState")
const PromoteTaskAPI = require("./restAPI/PromoteTask2Done")

app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)



//routes
AddController(app)
CheckGroupController(app)
LoginController(app)
UpdateController(app)
AddGroupController(app)
GetApplication(app)
GetPlan(app)
GetTask(app)

/* ASSIGNMENT 3 */
CreatedTaskAPI(app)
TaskStateAPI(app)
PromoteTaskAPI(app)

app.use("*", function checkroute(req, res) {
  res.send({ code: 4004 })
})

app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

module.export = app
