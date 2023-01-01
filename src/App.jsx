import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Landing from "./components/Landing";
import Profile from './components/Profile';
import Register from './components/Register';
import Event from './components/Event';
import Home from './components/Home';

import ProtectedRoute from './services/ProtectedRoute';
import AppPanel from './crud/AppPanel';
import About from './components/About';


const App = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Landing/>}/>
        <Route path='register' element={<Register/>}/>
      </Route>

      <Route element={<ProtectedRoute/>}>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/event/:id' element={<Event/>}/>
        <Route path='*' element={<h1>Route Dosent Exists, Sorry</h1>}/>
      </Route> 
      <Route path='/panel/*' element={<AppPanel/>}/>
      <Route path='/about' element={<About/>}/>
    </Routes>
  )
}

export default App