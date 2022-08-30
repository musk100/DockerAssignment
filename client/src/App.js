import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import AddEdit from "./pages/AddUser"
import Home from "./pages/Home"
import AdminLogin from "./pages/AdminLogin"
import View from "./pages/View"
import ChangePassword from "./pages/ChangePassword"
import User from "./pages/User"
import UserChangePassword from "./pages/UserChangePassword"
import UserChangeEmail from "./pages/UserChangeEmail"
import CreateUserGroup from "./pages/CreateUserGroup"
import Application from "./pages/Application"
import TaskPage from "./pages/TaskPage"
import TaskEdit from "./pages/TaskEdit"
import TaskView from "./pages/TaskView"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/application" element={<Application />} />
          <Route path="/taskedit/:Task_name" element={<TaskEdit/>} />
          <Route path="/view/:Task_name" element={<TaskView/>} />
          <Route path="/taskpage/:App_Acronym" element={<TaskPage />} />
          <Route path="/mainmenu" element={<Home />} />
          <Route path="/" element={<AdminLogin />} />
          <Route path="/addUser" element={<AddEdit />} />
          <Route path="/addUserGroup" element={<CreateUserGroup />} />
          <Route path="/update/:username" element={<View />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/userchangepassword" element={<UserChangePassword />} />
          <Route path="/userchangeemail" element={<UserChangeEmail />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
