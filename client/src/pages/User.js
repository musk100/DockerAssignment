import React, { useState, useEffect } from "react"
import "./Home.css"
import Axios from "axios"
import UserHeader from ".//UserHeader"
import "./AddUser.module.css"
import "./View.css"

function User() {
  const [data, setData] = useState([])
  const [user, setUser] = useState("")

  //on initial load, fetch all data from backend
  useEffect(() => {
    loadData()
  }, [])

  //fetch all data from API
  const loadData = async () => {
    const response = await Axios.get("http://localhost:5000/api/get")
    setData(response.data)
  }

  return (
    <>
      <UserHeader />
      <div style={{ marginTop: "100px" }}>
        <h2>User Profile</h2>
        <div className="card">
          <div className="card-header">
            <p>User Contact Detail</p>
          </div>
          <div className="container">
            <strong>Username:</strong>
            <span>{user.username}</span>
            <br />
            <br />
            <strong>Email:</strong>
            <span>{user.email}</span>
            <br />
            <br />
            <strong>UserGroup:</strong>
            <span>{user.usergroup}</span>
            <br />
            <br />
            <strong>Status:</strong>
            <span>{user.status}</span>
            <br />
            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export default User
