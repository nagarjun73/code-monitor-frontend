import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import Editor from '@monaco-editor/react';
import Dashboard from './components/dashboard'

const url = import.meta.env.VITE_BACKEND_SERVER_URL

const socket = io.connect(url)

function App() {
  const [groupId, setGroupId] = useState('')
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [display, setDisplay] = useState([])
  const [isDashboard, setDashboard] = useState(false)
  const [userId, setUserId] = useState('')
  const [keyCounter, setKeyCounter] = useState(0)
  const [welcomeMsg, setWelcomeMsg] = useState('')

  function joinGroupFun() {
    socket.emit('join_group', { groupId, name })
  }

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('localUser'))
    console.log(localUser)

    if (localUser) {
      axios.post(`${url}/api/messages`, localUser)
        .then((res) => {
          console.log(res.data)
          setText(res.data.msg)
          setName(res.data.userName)
          setGroupId(res.data.groupId)
          setUserId(res.data.userId)
          setWelcomeMsg(res.data.userId)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  useEffect(() => {
    setKeyCounter(keyCounter + 1)
    if (keyCounter % 5 == 0) {
      console.log(text)
      socket.emit("text_input", { groupId, text, userId })
    }
  }, [text])

  useEffect(() => {
    axios.get(`${url}/api/messages`)
      .then((res) => {
        setDisplay(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [display])

  useEffect(() => {
    socket.on("display_data", (data) => {
      axios.get(`${url}/api/messages`)
        .then((res) => {
          setDisplay(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
    socket.on("SAVE_USER", (data) => {
      localStorage.setItem("localUser", JSON.stringify({ userId: data.userId }))
      setUserId(data.userId)
      setWelcomeMsg(res.data.userId)
    })
  }, [socket.on])

  function dashboardHandle() {
    setDashboard(!isDashboard)
  }

  return (
    <>
      <h1>GroupChat</h1>
      {welcomeMsg && <h3 style={{ color: 'green' }}>Welcome {welcomeMsg}</h3>}
      <button onClick={dashboardHandle}>Dashboard</button>
      {!isDashboard ?
        <div>
          <label>Join Group</label><br />
          <input type="text" placeholder='group id' value={groupId} onChange={(e) => setGroupId(e.target.value)} />
          <input type="text" placeholder='write your name' value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={joinGroupFun}>Join Group</button><br />
          <br />
          <br />
          <Editor height="40vh" defaultLanguage="javascript" defaultValue="// some comment" value={text} onChange={(val) => setText(val)} />
          {/* <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea><br /> */}
        </div>
        :
        <Dashboard display={display} groupId={groupId} />
      }
    </>
  )
}

export default App
