import React from 'react'
import GoogleAuth from '../services/GoogleAuth'

const Landing = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className="h-[10rem] flex bg-gradient-to-r from-cyan-300 to-blue-300 justify-center items-center rounded shadow p-5">
        <h1 className="text-6xl font-bold p-4">Welcome To IG Forum</h1>
      </div>
      <div className="h-96 mx-auto flex flex-row justify-center items-center m-16">
        <div className="container">
          <div className='basis-1/2 flex flex-col justify-center items-center'>
            <div className='p-4 text-center'>
              <p className='text-lg font-bold'>Sign In / Register</p>
              <p className='text-sm'>Using <span className='text-md font-bold text-red-800'>NITW Google Account</span></p>
            </div>
            <GoogleAuth/>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Landing