import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from '../src/pages/Hero'
import Signup from '../src/pages/Signup'
import Login from '../src/pages/Login'
import Home from '../src/pages/Home'
import Settings from '../src/pages/Settings'



const routes = (
  <Router>
      <Routes>
        <Route path="/" element={<Hero />}/>
        <Route path="/v1/signup" element={<Signup />}/>
        <Route path="/v1/login" element={<Login />}/>
        <Route path="/v1/auth/dashboard" element={<Home />}/>
        <Route path="/v1/auth/dashboard/settings" element={<Settings />}/>
      </Routes>
    </Router>
)

function App() {

  return (
    <>
      {routes}
    </>
  )
}

export default App
