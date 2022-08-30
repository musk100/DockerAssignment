import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Select from "react-select"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import { Edit } from "react-feather"

function TaskEdit() {
  const [taskNote, setTaskNote] = useState("")
  const [taskPlan, setTaskPlan] = useState()
  const { Task_name } = useParams()
  console.log(Task_name)
  const navigate = useNavigate()

  const [selectedOption, setSelectedOption] = useState()
  const [user, setUser] = useState("")
  const [users, setUsers] = useState("")
  const [isProjectLead, setIsProjectLead] = useState(false)
  const [userData, setUserData] = useState([])
  const [groupNameData, setGroupNameData] = useState("")
  const [audit, setAudit] = useState("")

  //handle dropdown select value
  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    setTaskPlan(selectedOption.value)
    console.log(selectedOption)
  }

  let username = localStorage.getItem("username")
  const makeRequest = async () => {
    try {
      const response = await Axios.post("http://localhost:5000/api/getTaskGroup", {
        username
      })
      setGroupNameData(response.data.groupname)
      setIsProjectLead(username)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    makeRequest()
  })

  const handleUpdateTask = async e => {
    e.preventDefault()
    if (!user.Task_name) {
      toast.error("Please provide value for the required fields", { autoClose: 1000 })
    }
    {
      const response = await Axios.put(`http://localhost:5000/api/updateTask/${Task_name}`, {
        Task_name,
        task_Desc: user.Task_description,
        task_Notes: taskNote,
        task_Id: user.Task_id,
        task_Plan: user.Task_plan,
        App_Acronym: user.Task_app_Acronym,
        task_State: user.Task_state,
        isProjectLead,
        task_Owner: username,
        App_Rno: users.App_Rnumber
      }).catch(e => {
        console.log(e)
      })
        if (response) {
          toast.success("Task Updated!", { autoClose: 1000 })
          setSelectedOption(null)
        }
    }
  }

  useEffect(() => {
    const getPlan = async () => {
      const response = await Axios.get("http://localhost:5000/api/getPlan")
      console.log(response)
      setUserData(response.data)
    }
    getPlan()
  }, [])

  useEffect(() => {
    Axios.get("http://localhost:5000/api/getApplication").then(response => setUsers({ ...response.data[0] }))
  }, [])

  const makeAudit = async () => {
    const response = await Axios.get("http://localhost:5000/api/getAudit", {
      params: {
        Task_name
      }
    })
    setAudit(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    makeAudit()
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/getTaskDetails/${Task_name}`).then(response => setUser({ ...response.data[0] }))
  }, [Task_name])

  return (
    <Container style={{ marginTop: "50px" }}>
      <h3 style={{ textAlign: "center" }}>View</h3>
      <Form style={{ width: "100%", alignContent: "center", marginTop: "50px" }} onSubmit={handleUpdateTask}>
        <Row>
          <Form.Group as={Col} controlId="formGridPlanName" className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              style={{ width: "800px", backgroundColor: "white" }}
              type="text"
              placeholder="Task name..."
              value={user.Task_name}
              onChange={e => {
                setUser({ ...user, Task_name: e.target.value })
              }}
              readOnly
            />
            <Form.Group as={Col} controlId="formGridPlanAppAcronym" style={{ marginTop: "15px" }}>
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Hello I am a durian..."
                rows={3}
                autoFocus
                value={user.Task_description}
                readOnly
              />
            </Form.Group>
           
            <Form.Group as={Col} className="mb=3" controlId="formGridStart" style={{ marginTop: "13px" }}>
              <Form.Label>Task Plan</Form.Label>
              <Form.Control
              style={{ width: "800px", backgroundColor: "white" }}
              type="text"
              placeholder="Task name..."
              value={user.Task_plan}
              readOnly
            />
            </Form.Group>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPlanAppAcronym" style={{ marginTop: "5px" }}>
            <Form.Label>Task Notes</Form.Label>
            <Form.Control style={{ backgroundColor: "lightsteelblue" }} 
             as="textarea"
             rows={12} 
             value={user.Task_notes} 
             readOnly 
             />
          </Form.Group>
        </Row>

        <Button onClick={() => navigate(-1)} variant="secondary">
          Back
        </Button>
      </Form>
    </Container>
  )
}

export default TaskEdit
