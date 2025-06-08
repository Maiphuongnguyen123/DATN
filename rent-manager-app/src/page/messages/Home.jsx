import React from 'react'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import './style.css'
import { UserProvider } from "./context/UserContext";

const Home = (props) => {
  return (
    <UserProvider>
      <div className="messenger-container">
        <Sidebar {...props} />
        <Chat {...props} />
      </div>
    </UserProvider>
  )
}

export default Home 