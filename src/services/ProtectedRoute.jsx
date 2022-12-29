import React from 'react'
import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom'
import useUserStore from './Store'

import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ redirectPath = '/' }) => {
  const user = useUserStore(state => state.authUser);
  return (user ? <Logout/> : <Navigate to={redirectPath} replace/>)

}

const Logout = () => {
  // Global State
  const setUser = useUserStore(state => state.setUser);
  const sessionToken = useUserStore(state => state.sessionToken);

  // Local State
  const [displayOrgPanel, setDisplay] = React.useState(false);

  // Navigation
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    return navigate('/');
  }

  const handleProfile = () => navigate('/profile');
  
  const handleOrgPanel = () => navigate('/panel');

  React.useEffect(() => {
    const decode_token = jwt_decode(sessionToken);
    if(decode_token.user.isOrganization) return setDisplay(true);

  }, [])

  return (
    <div>
      <Link to='/' onClick={() => setUser(null)}>Logout</Link>
      <br/>
      <Link to='/profile'>Profile</Link>
      <br/>
      <Link to='/home'>Home</Link>
      <br/>
      {displayOrgPanel ? <Link to='/panel'>Organization Panel</Link> : null}
      <hr/>
      <Outlet/>
    </div>
  
  )
}
export default ProtectedRoute