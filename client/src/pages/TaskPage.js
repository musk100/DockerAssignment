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
import Modal from "react-bootstrap/Modal"
import { ChevronLeft, LogOut, Edit, ArrowRightCircle, ArrowLeftCircle, Eye } from "react-feather"
import "./TaskPage.css"

const TaskPage = () => {
  const [planName, setPlanName] = useState("")
  const [planStart, setPlanStart] = useState("")
  const [planEnd, setPlanEnd] = useState("")
  const { App_Acronym } = useParams()

  const [userData, setUserData] = useState([])
  const [data, setData] = useState([])
  const [groupNameData, setGroupNameData] = useState("")

  const [taskName, setTaskName] = useState("")
  const [taskDesc, setTaskDesc] = useState("")
  const [taskNote, setTaskNote] = useState("")
  const [taskPlan, setTaskPlan] = useState()
  const [taskId, setTaskId] = useState("")
  const [isProjectLead, setIsProjectLead] = useState(false)
  const [taskDate, setTaskDate] = useState("")

  const [user, setUser] = useState("")

  const [show, setShow] = useState(false)
  const [unshow, setUnShow] = useState(false)
  const [unshows, setUnShows] = useState(false)

  let { startDate, endDate } = user

  const [appCreate, setAppCreate] = useState()
  const [appOpen, setAppOpen] = useState()
  const [appToDo, setAppToDo] = useState()
  const [appDoing, setAppDoing] = useState()
  const [appDone, setAppDone] = useState()
  const [dropdown, setDropdown] = useState([])

  const [selectedOption, setSelectedOption] = useState()
  const [selectedOptions, setSelectedOptions] = useState()
  const [selectedOption1, setSelectedOption1] = useState()
  const [selectedOption2, setSelectedOption2] = useState()
  const [selectedOption3, setSelectedOption3] = useState()
  const [selectedOption4, setSelectedOption4] = useState()

  //handle dropdown select value
  const handleChanged = selectedOptions => {
    setSelectedOptions(selectedOptions)
    setAppCreate(selectedOptions.value)
    console.log(selectedOptions)
  }

  const handleChange1 = selectedOption1 => {
    setSelectedOption1(selectedOption1)
    setAppOpen(selectedOption1.value)
    console.log(selectedOption1)
  }

  const handleChange2 = selectedOption2 => {
    setSelectedOption2(selectedOption2)
    setAppToDo(selectedOption2.value)
    console.log(selectedOption2)
  }

  const handleChange3 = selectedOption3 => {
    setSelectedOption3(selectedOption3)
    setAppDoing(selectedOption3.value)
    console.log(selectedOption3)
  }

  const handleChange4 = selectedOption4 => {
    setSelectedOption4(selectedOption4)
    setAppDone(selectedOption4.value)
    console.log(selectedOption4)
  }

  let username = localStorage.getItem("username")
  const makeRequest = async () => {
    try {
      console.log(username)
      const response = await Axios.post("http://localhost:5000/api/getTaskGroup", {
        username
      })
      console.log(response.data.groupname)
      setGroupNameData(response.data.groupname)
      setIsProjectLead(username)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    makeRequest()
  }, [])

  //handle dropdown select value
  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    setTaskPlan(selectedOption.value)
    console.log(selectedOption)
  }

  const handleClose = () => {
    setShow(false)
    setPlanName("")
    setPlanStart("")
    setPlanEnd("")
  }
  const handleUnClose = () => {
    setUnShow(false)
    setTaskName("")
    setTaskDesc("")
    setSelectedOption(null)
    setTaskNote("")
  }

  const handleUnClosed = () => {
    setUnShows(false)
  }

  const handleShow = () => setShow(true)
  const handleUnShow = () => setUnShow(true)
  const handleUnShows = () => setUnShows(true)

  const navigate = useNavigate()

  async function handleLogout(e) {
    localStorage.removeItem("login")
    localStorage.removeItem("username")
    navigate("/")
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!planName || !planStart || !planEnd || !App_Acronym) {
      toast.error("Please provide value for the required fields", { autoClose: 1000 })
    }
    {
      console.log(App_Acronym)
      const response = await Axios.post("http://localhost:5000/api/postPlan", {
        plan_Name: planName,
        plan_Start: planStart,
        plan_End: planEnd,
        plan_app_Acronym: App_Acronym
      }).catch(e => {
        console.log(e)
      })
      const isDuplicate = response.data
      if (planName && planStart && planEnd && isDuplicate !== false) {
        toast.success("Plan Created!", { autoClose: 1000 })
        //clear all input values if create plan is successful
        setPlanName("")
        setPlanStart("")
        setPlanEnd("")
      } else {
        toast.error("Duplicate Plan Name Detected", { autoClose: 1500 })
        setPlanName("")
        setPlanStart("")
        setPlanEnd("")
      }
    }
  }

  const handleSubmits = async e => {
    e.preventDefault()
    if (!taskName) {
      toast.error("Please provide value for the required fields", { autoClose: 1000 })
    }
    {
      const response = await Axios.post("http://localhost:5000/api/postTask", {
        Task_name: taskName,
        Task_description: taskDesc,
        task_Notes: taskNote,
        Task_id: taskId,
        task_Plan: taskPlan,
        App_Acronym,
        task_State: "Open",
        isProjectLead,
        task_Owner: username,
        task_CreateDate: taskDate,
        App_Rno: user.App_Rnumber
      }).catch(e => {
        console.log(e)
      })
      const isDuplicate = response.data
      if (taskName && isDuplicate) {
        toast.success("Task Created!", { autoClose: 1000 })
        setTaskName("")
        setTaskDesc("")
        setTaskNote("")
        setSelectedOption(null)
      } else {
        toast.error("Duplicate task name detected!", { autoClose: 1000 })
      }
    }
  }

  const handleUpdateApplication = async e => {
    e.preventDefault()
    if (!selectedOptions && !selectedOption1 && !selectedOption2 && !selectedOption3 && !selectedOption4) {
      toast.error("Please fill in App Permit!", { autoClose: 1000 })
    }
    {
      const response = await Axios.put(`http://localhost:5000/api/updateApplication/${App_Acronym}`, {
        app_Desc: user.App_Description,
        app_Rno: user.App_Rnumber,
        app_Start: startDate,
        app_End: endDate,
        app_Create: appCreate,
        app_Open: appOpen,
        app_ToDo: appToDo,
        app_Doing: appDoing,
        app_Done: appDone
      }).catch(e => {
        console.log(e)
      })
      if (selectedOptions && selectedOption1 && selectedOption2 && selectedOption3 && selectedOption4) {
        toast.success("Application Updated!", { autoClose: 1000 })
      }
    }
  }

  const getPlan = async () => {
    const response = await Axios.get("http://localhost:5000/api/getPlan", {
      params: {
        App_Acronym
      }
    })
    console.log(response)
    setUserData(response.data)
  }
  useEffect(() => {
    getPlan()
  }, [show])

  const getTask = async () => {
    const response = await Axios.get("http://localhost:5000/api/getTask", {
      params: {
        App_Acronym
      }
    })
    console.log(response)
    setData(response.data)
  }
  useEffect(() => {
    getTask()
  }, [unshow])

  //Load database group values into dropdown list
  const getGroup = async () => {
    const response = await Axios.get("http://localhost:5000/api/getGrouping")
    console.log(response)
    setDropdown(response.data)
  }
  useEffect(() => {
    getGroup()
  }, [])

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/getApplicationDetails/${App_Acronym}`).then(response => setUser({ ...response.data[0] }))
  }, [unshows])

  return (
    <>
      <div style={{ backgroundColor: "aliceblue", height: "100%" }}>
        <Card style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}>
          <Card.Header as="h5" style={{ textAlign: "center" }}>
            Application Information
            {groupNameData.includes("project lead") ? (
              <a style={{ cursor: "pointer" }} className="nav-links" onClick={handleUnShows}>
                <Edit />
              </a>
            ) : null}
          </Card.Header>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Title className="leftright" style={{ display: "flex" }}>
                    Application: {user.App_Acronym}
                    <Card.Title className="leftright">Running Number: {user.App_Rnumber}</Card.Title>
                    <Card.Title className="leftright">Start Date: {user.startDate}</Card.Title>
                    <Card.Title className="leftright">End Date: {user.endDate}</Card.Title>
                  </Card.Title>
                  <br />
                  <Card.Title className="leftright" style={{ display: "flex" }}>
                    App Permit Create: {user.App_permit_Create}
                    <Card.Title className="leftright">App Permit Open: {user.App_permit_Open}</Card.Title>
                    <Card.Title className="leftright">App Permit ToDo: {user.App_permit_toDoList}</Card.Title>
                    <Card.Title className="leftright">App Permit Doing: {user.App_permit_Doing}</Card.Title>
                    <Card.Title className="leftright">App Permit Done: {user.App_permit_Done}</Card.Title>
                    <Link to="/application">
                      <a className="nav-linkss">
                        <ChevronLeft />
                      </a>
                    </Link>
                    <Link to="/">
                      <a className="nav-link" onClick={handleLogout}>
                        <LogOut />
                      </a>
                    </Link>
                  </Card.Title>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <div className="d-flex align-items-center justify-content-center" style={{ marginTop: "10px" }}>
          {groupNameData.includes("project manager") ? (
            <Button variant="primary" onClick={handleShow}>
              Add Plan
            </Button>
          ) : null}
          {groupNameData.includes(user.App_permit_Create) ? (
            <Button variant="primary" onClick={handleUnShow}>
              Add Task
            </Button>
          ) : null}
        </div>
        <Container fluid>
          <Row xs={1} md={2} lg={4} xl={6} className="g-4">
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>Plan Management</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {userData.map((userData, k) => (
                        <Col>
                          <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                            <Card.Body>
                              <Card.Title style={{ display: "flex", marginBottom: "5%" }}>{userData.Plan_MVP_name}</Card.Title>
                              <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                {userData.Plan_app_Acronym}
                              </Card.Subtitle>
                              <Card.Text>Start Date: {userData.startDate}</Card.Text>
                              <Card.Text>End Date: {userData.endDate}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>Open</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {data
                        .filter(data => data.Task_state == "Open")
                        .map(filteredData => {
                          const postTask = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "To Do",
                              currentState: "Open",
                              task_Owner: username
                            })
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }
                          return (
                            <Col>
                              <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                                <Card.Body>
                                  <Card.Title style={{ display: "flex", marginBottom: "5%" }}>
                                    {filteredData.Task_name}
                                    <Link to={`/view/${filteredData.Task_name}`}>
                                      <a style={{ marginRight: "35px" }} className="nav-linked">
                                        <Eye />
                                      </a>
                                    </Link>
                                    {groupNameData.includes(user.App_permit_Open) ? (
                                      <Link to={`/taskedit/${filteredData.Task_name}`}>
                                        <a className="nav-linked">
                                          <Edit />
                                        </a>
                                      </Link>
                                    ) : null}
                                  </Card.Title>
                                  <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                    {filteredData.Task_description}
                                  </Card.Subtitle>
                                  <Card.Text>Task Creator: {filteredData.Task_creator}</Card.Text>
                                  <Card.Text>Task Owner: {filteredData.Task_owner}</Card.Text>
                                  {groupNameData.includes(user.App_permit_Open) ? (
                                    <Button
                                      onClick={() => {
                                        postTask()
                                      }}
                                      type="submit"
                                      variant="primary"
                                      style={{ float: "right" }}
                                    >
                                      <ArrowRightCircle />
                                    </Button>
                                  ) : null}
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>ToDo</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {data
                        .filter(data => data.Task_state == "To Do")
                        .map(filteredData => {
                          const postTasks = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "Doing",
                              currentState: "To Do",
                              task_Owner: username
                            })
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }
                          return (
                            <Col>
                              <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                                <Card.Body>
                                  <Card.Title style={{ display: "flex", marginBottom: "5%" }}>
                                    {filteredData.Task_name}
                                    <Link to={`/view/${filteredData.Task_name}`}>
                                      <a style={{ marginRight: "35px" }} className="nav-linked">
                                        <Eye />
                                      </a>
                                    </Link>
                                    {groupNameData.includes(user.App_permit_toDoList) ? (
                                      <Link to={`/taskedit/${filteredData.Task_name}`}>
                                        <a className="nav-linked">
                                          <Edit />
                                        </a>
                                      </Link>
                                    ) : null}
                                  </Card.Title>
                                  <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                    {filteredData.Task_description}
                                  </Card.Subtitle>
                                  <Card.Text>Task Creator: {filteredData.Task_creator}</Card.Text>
                                  <Card.Text>Task Owner: {filteredData.Task_owner}</Card.Text>
                                  {groupNameData.includes(user.App_permit_toDoList) ? (
                                    <Button
                                      onClick={() => {
                                        postTasks()
                                      }}
                                      style={{ float: "right" }}
                                      type="submit"
                                      variant="primary"
                                    >
                                      <ArrowRightCircle />
                                    </Button>
                                  ) : null}
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>Doing</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {data
                        .filter(data => data.Task_state == "Doing")
                        .map(filteredData => {
                          const postTask = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "To Do",
                              currentState: "Doing",
                              task_Owner: username
                            })
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }

                          const postTasks = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "Done",
                              currentState: "Doing",
                              task_Owner: username,
                              task_Creator: filteredData.Task_creator
                            })
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }
                          return (
                            <Col>
                              <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                                <Card.Body>
                                  <Card.Title style={{ display: "flex", marginBottom: "5%" }}>
                                    {filteredData.Task_name}
                                    <Link to={`/view/${filteredData.Task_name}`}>
                                      <a style={{ marginRight: "35px" }} className="nav-linked">
                                        <Eye />
                                      </a>
                                    </Link>
                                    {groupNameData.includes(user.App_permit_Doing) ? (
                                      <Link to={`/taskedit/${filteredData.Task_name}`}>
                                        <a className="nav-linked">
                                          <Edit />
                                        </a>
                                      </Link>
                                    ) : null}
                                  </Card.Title>
                                  <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                    {filteredData.Task_description}
                                  </Card.Subtitle>
                                  <Card.Text>Task Creator: {filteredData.Task_creator}</Card.Text>
                                  <Card.Text>Task Owner: {filteredData.Task_owner}</Card.Text>
                                  {groupNameData.includes(user.App_permit_Doing) ? (
                                    <Button
                                      onClick={() => {
                                        postTask()
                                      }}
                                      type="submit"
                                      variant="primary"
                                    >
                                      <ArrowLeftCircle />
                                    </Button>
                                  ) : null}
                                  {groupNameData.includes(user.App_permit_Doing) ? (
                                    <Button
                                      onClick={() => {
                                        postTasks()
                                      }}
                                      style={{ float: "right" }}
                                      type="submit"
                                      variant="primary"
                                    >
                                      <ArrowRightCircle />
                                    </Button>
                                  ) : null}
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>Done</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {data
                        .filter(data => data.Task_state == "Done")
                        .map(filteredData => {
                          const postTask = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "Doing",
                              currentState: "Done",
                              task_Owner: username
                            })
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }
                          const postTasks = async () => {
                            const response = await Axios.put("http://localhost:5000/api/postState", {
                              task_Name: filteredData.Task_name,
                              newState: "Close",
                              currentState: "Done",
                              task_Owner: username
                            })
                            console.log(filteredData.Task_owner)
                            if (!response.data.error) {
                              getTask()
                              console.log(response.data)
                            }
                          }
                          return (
                            <Col>
                              <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                                <Card.Body>
                                  <Card.Title style={{ display: "flex", marginBottom: "5%" }}>
                                    {filteredData.Task_name}
                                    <Link to={`/view/${filteredData.Task_name}`}>
                                      <a style={{ marginRight: "35px" }} className="nav-linked">
                                        <Eye />
                                      </a>
                                    </Link>
                                    {groupNameData.includes(user.App_permit_Done) ? (
                                      <Link to={`/taskedit/${filteredData.Task_name}`}>
                                        <a className="nav-linked">
                                          <Edit />
                                        </a>
                                      </Link>
                                    ) : null}
                                  </Card.Title>
                                  <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                    {filteredData.Task_description}
                                  </Card.Subtitle>
                                  <Card.Text>Task Creator: {filteredData.Task_creator}</Card.Text>
                                  <Card.Text>Task Owner: {filteredData.Task_owner}</Card.Text>
                                  {groupNameData.includes(user.App_permit_Done) ? (
                                    <Button
                                      onClick={() => {
                                        postTask()
                                      }}
                                      type="submit"
                                      variant="primary"
                                    >
                                      <ArrowLeftCircle />
                                    </Button>
                                  ) : null}
                                  {groupNameData.includes(user.App_permit_Done) ? (
                                    <Button
                                      onClick={() => {
                                        postTasks()
                                      }}
                                      style={{ float: "right" }}
                                      type="submit"
                                      variant="primary"
                                    >
                                      <ArrowRightCircle />
                                    </Button>
                                  ) : null}
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {Array.from({ length: 1 }).map((_, idx) => (
              <Col>
                <Card style={{ marginTop: "40px" }}>
                  <Card.Header style={{ backgroundColor: "antiquewhite", textAlign: "center" }}>Closed</Card.Header>
                  <Card.Body>
                    <Row xs={1} md={1} lg={1} xl={1}>
                      {data
                        .filter(data => data.Task_state == "Close")
                        .map(filteredData => {
                          return (
                            <Col>
                              <Card style={{ margin: "10px", backgroundColor: "azure" }}>
                                <Card.Body>
                                  <Card.Title style={{ display: "flex", marginBottom: "5%" }}>
                                    {filteredData.Task_name}
                                    <Link to={`/view/${filteredData.Task_name}`}>
                                      <a style={{ marginRight: "35px" }} className="nav-linked">
                                        <Eye />
                                      </a>
                                    </Link>
                                  </Card.Title>
                                  <Card.Subtitle className="line-ellipsis" style={{ marginBottom: "5%" }}>
                                    {filteredData.Task_description}
                                  </Card.Subtitle>
                                  <Card.Text>Task Creator: {filteredData.Task_creator}</Card.Text>
                                  <Card.Text>Task Owner: {filteredData.Task_owner}</Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        <Modal size="xl" show={unshows} onHide={handleUnClosed} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{ borderRadius: "100%" }}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridAppAcronym">
                  <Form.Label>App Acronym</Form.Label>
                  <Form.Control style={{ backgroundColor: "white" }} type="text" placeholder="App name..." autoFocus value={user.App_Acronym} readOnly />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridRunningNumber" style={{ marginTop: "0px" }}>
                  <Form.Label style={{ marginBottom: "15px" }}>App Running Number</Form.Label>
                  <Form.Control style={{ height: "48px" }} type="number" placeholder="Running Number..." value={user.App_Rnumber} readOnly />
                </Form.Group>
              </Row>
              <Form.Group as={Col} className="mb-4" controlId="exampleForm.ControlTextarea1">
                <Form.Label>App Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="App Description..."
                  rows={3}
                  value={user.App_Description}
                  onChange={e => {
                    setUser({ ...user, App_Description: e.target.value })
                  }}
                  readOnly
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlD="formGridStart">
                  <Form.Label>App Start Date</Form.Label>
                  <Form.Control
                    className="input1"
                    type="date"
                    value={user.startDate}
                    onChange={e => {
                      setUser({ ...user, startDate: e.target.value })
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} controlID="formGridEnd">
                  <Form.Label>App End Date</Form.Label>
                  <Form.Control
                    className="input2"
                    type="date"
                    value={user.endDate}
                    onChange={e => {
                      setUser({ ...user, endDate: e.target.value })
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridOpen">
                  <Form.Label>App Permit Create</Form.Label>
                  <Select
                    className="reactSelect"
                    options={dropdown.map(data => {
                      return { label: data.usergroup, value: data.usergroup }
                    })}
                    onChange={handleChanged}
                    value={selectedOptions}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridOpen">
                  <Form.Label>App Permit Open</Form.Label>
                  <Select
                    className="reactSelect"
                    options={dropdown.map(data => {
                      return { label: data.usergroup, value: data.usergroup }
                    })}
                    onChange={handleChange1}
                    value={selectedOption1}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridToDo">
                  <Form.Label>App Permit ToDo</Form.Label>
                  <Select
                    className="reactSelect"
                    options={dropdown.map(data => {
                      return { label: data.usergroup, value: data.usergroup }
                    })}
                    onChange={handleChange2}
                    value={selectedOption2}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDoing">
                  <Form.Label>App Permit Doing</Form.Label>
                  <Select
                    className="reactSelect"
                    options={dropdown.map(data => {
                      return { label: data.usergroup, value: data.usergroup }
                    })}
                    onChange={handleChange3}
                    value={selectedOption3}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDone">
                  <Form.Label>App Permit Done</Form.Label>
                  <Select
                    className="reactSelect"
                    options={dropdown.map(data => {
                      return { label: data.usergroup, value: data.usergroup }
                    })}
                    onChange={handleChange4}
                    value={selectedOption4}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUnClosed}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateApplication}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal size="xl" show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{ borderRadius: "100%" }}>
              <Row>
                <Form.Group as={Col} controlId="formGridPlanName">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control
                    style={{ width: "540px", backgroundColor: "white" }}
                    type="text"
                    placeholder="Plan name..."
                    autoFocus
                    value={planName}
                    onChange={e => {
                      setPlanName(e.target.value)
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPlanColour">
                  <Form.Label>Plan Colour</Form.Label>
                  <Form.Control type="color" style={{marginTop: "10px", width: "540px", backgroundColor: "lightgrey" }} placeholder="Plan App name..." />
                </Form.Group>
                {/* <Form.Group as={Col} controlId="formGridPlanAppAcronym">
                  <Form.Label>Plan Application</Form.Label>
                  <Form.Control style={{ width: "540px", backgroundColor: "lightgrey" }} type="text" placeholder="Plan App name..." autoFocus value={user.App_Acronym} readOnly />
                </Form.Group> */}
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Form.Group as={Col} className="mb=3" controlId="formGridStart">
                  <Form.Label>Plan Start Date</Form.Label>
                  <Form.Control
                    className="input1"
                    type="date"
                    value={planStart}
                    onChange={e => {
                      setPlanStart(e.target.value)
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEnd">
                  <Form.Label>Plan End Date</Form.Label>
                  <Form.Control
                    className="input2"
                    type="date"
                    value={planEnd}
                    onChange={e => {
                      setPlanEnd(e.target.value)
                    }}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal size="xl" show={unshow} onHide={handleUnClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{ borderRadius: "100%" }}>
              <Row>
                <Form.Group as={Col} controlId="formGridPlanName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    style={{ width: "540px", backgroundColor: "white" }}
                    type="text"
                    placeholder="Task name..."
                    value={taskName}
                    onChange={e => {
                      setTaskName(e.target.value)
                    }}
                  />

                  <Form.Group as={Col} controlId="formGridPlanAppAcronym" style={{ marginTop: "15px" }}>
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Hello I am a durian..."
                      rows={3}
                      autoFocus
                      value={taskDesc}
                      onChange={e => {
                        setTaskDesc(e.target.value)
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} className="mb=3" controlId="formGridStart" style={{ marginTop: "13px" }}>
                    <Form.Label>Task Plan</Form.Label>
                    <Select
                      className="reactSelect"
                      options={userData.map(data => {
                        return { label: data.Plan_MVP_name, value: data.Plan_MVP_name }
                      })}
                      onChange={handleChange}
                      value={selectedOption}
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPlanAppAcronym">
                  <Form.Label>Task Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="You want to add important notes here..."
                    rows={12}
                    autoFocus
                    value={taskNote}
                    onChange={e => {
                      setTaskNote(e.target.value)
                    }}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUnClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmits}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default TaskPage
