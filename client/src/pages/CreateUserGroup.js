import React, { useState } from "react"
import Axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Header from ".//Header"
import "./AddUser.module.css"

function CreateUserGroup() {
  const [creategroup, setCreateGroup] = useState("")
  const [usergroup, setUserGroup] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    if (!usergroup) {
      toast.error("Please key in a valid input for creating group!", { autoClose: 1000 })
    } else {
      Axios.post("http://localhost:5000/api/postGroup", { usergroup })
        .then(() => {
          setCreateGroup({ usergroup: "" })
        })
        .catch(err => toast.error(err.response.data))
    }
    if (usergroup) {
      toast.success("Group Created Successfully!", { autoClose: 1000 })
      //clear all input values if create group successful
      setUserGroup("")
    }
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <h2>Create Group</h2>
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
          <label htmlFor="usergroup">Group</label>
          <input
            type="text"
            id="group"
            name="group"
            placeholder="Group ..."
            value={usergroup || ""}
            onChange={event => {
              setUserGroup(event.target.value)
            }}
          />
          <input type="submit" value={"Save"} />
          <Link to="/mainMenu">
            <input type="button" value="Go Back" />
          </Link>
        </form>
      </div>
    </>
  )
}

export default CreateUserGroup
