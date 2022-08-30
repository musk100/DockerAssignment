import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./AddUser.module.css"
import Axios from "axios"
import { toast } from "react-toastify"
import UserHeader from ".//UserHeader"
import "./View.css"

const UserChangePassword = () => {
  const [user, setUser] = useState()
  const username = localStorage.getItem("username")
  const [password, setPassword] = useState("")

  function checkPassword(password) {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
    return re.test(password)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!username || !password) {
      toast.error("Please provide value for each input field!", { autoClose: 1000 })
    } else {
      Axios.put(`http://localhost:5000/api/updated/${username}`, {
        username,
        password
      })
        .then(() => {
          setUser({ username: "", password: "" })
        })
        .catch(err => toast.error(err.response.data))
    }
    if (username && password) {
      if (checkPassword(password) === true) {
        toast.success("User updated successfully!", { autoClose: 1000 })
        //clear input values
        setPassword("")
      } else if (checkPassword(password) === false) {
        toast.error("Please include uppercase characters, special characters, numbers and alphabets in the password field", { autoClose: 2500 })
      }
    }
  }

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/get/${username}`).then(response => setUser({ ...response.data[0] }))
  }, [username])

  return (
    <>
      <UserHeader />
      <div style={{ marginTop: "100px" }}>
        <h2>Update Profile</h2>
        <form
          autoComplete="off"
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center"
          }}
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name ..."
            value={username || ""}
            maxLength="12"
            onChange={event => {
              setUser({ ...user, username: event.target.value })
            }}
            disabled
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password ..."
            value={password || ""}
            maxLength={10}
            minLength={8}
            onChange={event => {
              setPassword(event.target.value)
            }}
          />
          <input type="submit" value={username ? "Update" : "Save"} />
          <Link to="/user">
            <input type="button" value="Go Back" />
          </Link>
        </form>
      </div>
    </>
  )
}

export default UserChangePassword
