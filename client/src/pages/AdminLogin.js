import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import { toast } from "react-toastify"
import "./AdminLogin.css"

const AdminLogin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  Axios.defaults.withCredentials = true

  async function handleSubmit(e) {
    e.preventDefault()
    //login user
    try {
      const response = await Axios.post("http://localhost:5000/login", {
        username: username,
        password: password
      })
      console.log(response)
      localStorage.setItem("login", response.data.login)
      localStorage.setItem("username", response.data.username)
      console.log(response.data.username)
      //if user logged in, fetch data from backend to get usergroup
      if (response.data.login === true) {
        try {
          const isStatus = response.data
          if (isStatus === "active") {
            isAdmin()
          } else if (isStatus === "inactive") {
            toast.error("Invalid Credentials")
          }
          const currentUser = response.data.username
          const group = await Axios.get("http://localhost:5000/api/getGroup", {
            params: {
              username: currentUser
            }
          })
          //if user is admin, navigate to admin page
          const isAdmin = group.data
          if (isAdmin === true) {
            navigate("/application")
          } else {
            navigate("/application")
          }
          console.log(group)
        } catch (e) {
          console.log("There was a problem")
        }
        toast.success("Login Successful!", { autoClose: 1000 })
      } else if (response.data.login === false) {
        toast.error("Invalid Credentials!", { autoClose: 1000 })
      } else if (response.data === "") {
        toast.error("Invalid Credentials!", { autoClose: 1000 })
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }

  Axios.defaults.withCredentials = true
  return (
    <>
      <div className="topnav" id="myTopnav">
        <a className="active">Login</a>
      </div>
      <br />
      <div>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <br />
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={event => {
                setUsername(event.target.value)
              }}
              required
            />
            <br />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <br />
            <Form.Control
              type="password"
              placeholder="Password"
              maxLength="12"
              name="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value)
              }}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  )
}

export default AdminLogin
