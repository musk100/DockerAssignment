import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./AddUser.module.css"
import Axios from "axios"
import { toast } from "react-toastify"
import UserHeader from ".//UserHeader"
import "./View.css"

const UserChangeEmail = () => {
  const [user, setUser] = useState()
  const username = localStorage.getItem("username")
  const [email, setEmail] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    if (!username || !email) {
      toast.error("Please provide value for each input field!", { autoClose: 1000 })
    } else {
      Axios.put(`http://localhost:5000/api/updates/${username}`, {
        username,
        email
      })
        .then(() => {
          setUser({ username: "", email: "" })
        })
        .catch(err => toast.error(err.response.data))
    }
    if (username && email) {
      toast.success("User updated successfully!", { autoClose: 1000 })
      //clear input values
      setEmail("")
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email ..."
            value={email || ""}
            onChange={event => {
              setEmail(event.target.value)
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

export default UserChangeEmail
