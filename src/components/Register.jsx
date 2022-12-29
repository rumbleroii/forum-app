import React from 'react'
import useUserStore from '../services/Store'
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const Register = () => {
  const setUser = useUserStore(state => state.setUser);
  const user = useUserStore(state => state.authUser);

  const navigate = useNavigate();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = React.useState('');
  
  React.useEffect(() => {
    if(location.state === null) {
      navigate("/", { replace: true });
    }
    if(user !== null){
      navigate('/home', { replace: true });
    }
  }, [])

  const createUserHandler = async () => {
    try {
      await axiosInstance.post('/users/register', {
        data: {
            name: location.state.name,
            email: location.state.email,
            avatar: location.state.picture,
            phoneNo: "+91"+phoneNumber
        },
      })

      // Setting User
      console.log("ACCOUNT CREATED");

      const server_session_token = await axiosInstance.post('/auth/login',{
        data : {
          email: location.state.email
        }
      })

      const sessionToken = server_session_token.data.accessToken;

      setUser(location.state, sessionToken);

      navigate('/home', { replace: true });
    } catch (err) {
      console.log(err);
    }
  } 

  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);
  
  return (
    <div>
      <h1>Register Your Account, Confirm Details</h1>
      <br/>
      <p>Name: {location?.state?.name}</p>
      <p>Email: {location?.state?.email}</p>
      <p>Avatar: <img src={`${location?.state?.picture}`} /></p>
      <label>Enter Phone Number</label>
      <input type='tel' name='phoneNo' onChange={handlePhoneChange} placeholder="Enter Number"/>
      <br/>
      <button onClick={createUserHandler}>Create Account</button>
    </div>
  )
}

export default Register