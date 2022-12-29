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
      <Link to='/' onClick={(() => setUser(null))}>Logout</Link>
      <br/>
      <Link to='/home'>Home</Link>
      <br/>
      <Link to='/panel/post'>Create Post</Link>
      <hr/>
      <Outlet/>
    </div>
  
  )
}
export default ProtectedRoute