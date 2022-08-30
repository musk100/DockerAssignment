import React, { useState, useEffect } from "react"
import CreatableSelect from "react-select/creatable"
import { useParams, Link } from "react-router-dom"
import "./AddUser.module.css"
import Axios from "axios"
import { toast } from "react-toastify"
import makeAnimated from "react-select/animated"
import Header from ".//Header"
import "./View.css"

const View = () => {
  const animatedComponents = makeAnimated()
  const [user, setUser] = useState("")
  const { username } = useParams()
  const [usergroup, setUserGroup] = useState([])
  const { email } = user
  const [status, setStatus] = useState("active")
  const [dropdown, setDropdown] = useState([])
  const [selectedOption, setSelectedOption] = useState([])

  const handleStatus = e => {
    setStatus(e.target.value)
    console.log(e.target.value)
  }

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    console.log(selectedOption)

    selectedOption.forEach(option => {
      const value = option.value
      setUserGroup([...usergroup, value])
      console.log(usergroup)
    })
  }

  function checkEmail(email) {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    return re.test(email)
  }

  useEffect(() => {
    const getGroup = async () => {
      const response = await Axios.get("http://localhost:5000/api/getGrouping")
      console.log(response)
      setDropdown(response.data)
    }
    getGroup()
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/get/${username}`).then(response => setUser({ ...response.data[0] }))
  }, [username])

  const handleSubmit = e => {
    e.preventDefault()

    if (!usergroup || !status) {
      toast.error("Please provide value for each input field!", { autoClose: 1000 })
    } else {
      Axios.put(`http://localhost:5000/api/update/${username}`, {
        email,
        usergroup,
        status
      })
        .then(() => {
          setUser({ email: "", usergroup: [], status: "" })
        })
        .catch(err => toast.error(err.response.data))
    }
    if (username && status) {
      if (checkEmail(email) === true) {
        toast.success("User Updated Successfully!", { autoClose: 1000 })
        //clear all input values if update user is successful
        setSelectedOption("")
        setStatus("")
      } // else if (checkEmail(email) === false) {
      //   toast.error("Please key in a correct email format")
      // }
    }
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: "150px" }}>
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
            <Link to="/mainmenu">
              <div className="btn btn-edit">Go Back</div>
            </Link>
          </div>
        </div>
        <div style={{ marginTop: "100px" }}>
          <h2>Update User Details</h2>
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
              value={user.username || ""}
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
              value={user.email || ""}
              onChange={event => {
                setUser({ ...user, email: event.target.value })
              }}
            />
            <label htmlFor="usergroup">User Group</label>
            {
              <CreatableSelect
                className="reactSelect"
                options={dropdown.map(data => {
                  return { label: data.usergroup, value: data.usergroup }
                })}
                components={animatedComponents}
                onChange={handleChange}
                isMulti
                defaultValue={selectedOption}
              />
            }
            <label htmlFor="status">Status</label>
            <select name="status" id="status" value={status || ""} onChange={handleStatus}>
              <option value="active" selected>
                Active
              </option>
              <option value="inactive">Inactive</option>
            </select>
            <input type="submit" value={username ? "Update" : "Save"} />
            <Link to="/mainmenu">
              <input type="button" value="Go Back" />
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}

export default View
