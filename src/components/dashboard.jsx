import Editor from '@monaco-editor/react';


const Dashboard = (props) => {
  const { display, groupId } = props
  return (
    <div>
      <h1>messages</h1>
      <div>
        {display.filter((ele) => ele.groupId == groupId).map((ele) => {
          return (<div key={ele.userId}>
            <h3>{ele.userName}</h3>
            <Editor height="40vh" defaultLanguage="javascript" value={ele.msg} />
          </div>)
        })}
      </div>
    </div>
  )
}

export default Dashboard