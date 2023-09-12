import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import Editor from '@monaco-editor/react';

const socket = io.connect("http://localhost:3066")

function App() {
  const [groupId, setGroupId] = useState('')
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [display, setDisplay] = useState([])
  const [isDashboard, setDashboard] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  function joinGroupFun() {
    socket.emit('join_group', { groupId, name })
  }

  useEffect(() => {
    socket.emit("text_input", { groupId, text })
  }, [text])

  useEffect(() => {
    axios.get('http://localhost:3066/api/messages')
      .then((res) => {
        setDisplay(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [display])

  useEffect(() => {
    socket.on("display_data", (data) => {
      axios.get('http://localhost:3066/api/messages')
        .then((res) => {
          setDisplay(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }, [socket.on])

  function dashboardHandle() {
    setDashboard(!isDashboard)
  }

  return (
    <>
      <h1>GroupChat</h1>

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
        <div>
          <h1>messages</h1>
          {/* <select onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">select</option>
            {display.filter((ele) => ele.groupId == groupId).map((ele, i) => {
              return <option key={i} value={ele.userId}>{ele.userName}</option>
            })}
          </select> <br />

          {selectedUserId && <Editor height="40vh" defaultLanguage="javascript" value={display.find((ele) => ele.userId == selectedUserId).msg} />} */}

          {display.filter((ele) => ele.groupId == groupId).map((ele) => {
            return (<div key={ele.userId}>
              <h3>{ele.userName}</h3>
              <Editor height="40vh" defaultLanguage="javascript" value={ele.msg} />
            </div>)
          })}
        </div>}
    </>
  )
}

export default App
