import React from 'react'
import GoogleAuth from '../services/GoogleAuth'



const Landing = () => {
  return (
    <div>
        <h1>Welcome To IG Forum</h1>
        <p>All In One Place, Login / Register To Know Everything</p>
        <br/>
        <label>Login / Register</label>
        <GoogleAuth/>
    </div>
  )
}

export default Landing