import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Home.css"
import Axios from "axios"
import Header from ".//Header"

const Home = () => {
  const [data, setData] = useState([])

  //fetch all data from API
  const loadData = async () => {
    const response = await Axios.get("http://localhost:5000/api/get")
    setData(response.data)
  }

  useEffect(() => {
    loadData()
  }, [])
  
  return (
    <>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <h2>Administrator Menu</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Username</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>User Group</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={item.username}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.usergroup}</td>
                  <td>{item.status}</td>
                  <td>
                    <Link to={`/update/${item.username}`}>
                      <button className="btn btn-edit">View & Edit</button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Home
