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
      <nav className='p-4 bg-Cblack shadow flex justify-between items-center'>
          <span className='text-2xl text-white font-bold'>
            <Link className='text-white hover:text-slate-500 font-bold' to='/home'>IG Forum</Link>
          </span>
        <div className='flex justify-center items-center gap-4'>
            <Link className='m-2 text-white hover:text-slate-500 font-bold' to='/home'>Home</Link>
            <Link className='m-2 text-white hover:text-slate-500 font-bold' to='/profile'>Profile</Link>
            <Link className='m-2 text-white hover:text-slate-500 font-bold' to='/about'>About</Link>
            {displayOrgPanel ? (
                <Link className="m-2 w-fit mx-auto bg-Cblue hover:bg-Cdarkblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to='/panel'>Organization Panel</Link>
            ) : null}
            <Link className="m-2 w-fit mx-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" to='/' onClick={() => setUser(null)}>Logout</Link>
             
        </div>
      </nav>
      <Outlet/>
    </div>
  )
}
export default ProtectedRoute