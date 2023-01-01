import React from 'react'
import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom'

import useUserStore from '../services/Store';
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ redirectPath = '/' }) => {
  const sessionToken = useUserStore(state => state.sessionToken);
  const decode_token = sessionToken ? jwt_decode(sessionToken) : null;
    
  console.log(decode_token);
  return (decode_token?.user?.isOrganization ? <NavBar/> : <Navigate to={redirectPath} replace/>)

}

const NavBar = () => {

  // Global State
  const setUser = useUserStore(state => state.setUser);

  // Navigation
  const navigate = useNavigate();

  return (
    <div>
        <nav className='p-4 bg-Cblack shadow flex justify-between items-center'>
            <span className='text-2xl text-white font-bold'>
            <Link className='text-white hover:text-slate-500 font-bold' to='/panel'>IG Forum Organizational Panel</Link>
            </span>
          <div className='flex justify-center items-center gap-4'>
            <Link className='m-2 text-slate-100 hover:text-slate-50	font-bold'to='/home'>Main Home</Link>
            <Link className="m-2 w-fit mx-auto bg-Cblue hover:bg-Cdarkblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to='/panel/post'>Create Post</Link>
            <Link className='m-2 w-fit mx-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' to='/' onClick={() => setUser(null)}>Logout</Link>
          </div>
        </nav>
        <Outlet/>
    </div>
  
  )
}
export default ProtectedRoute