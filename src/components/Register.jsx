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
      console.log(phoneNumber);
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
      <div>
        <div className="container mx-auto text-center mt-32">
          <h1 className="text-3xl font-bold p-4">Hi New User, Register Your Account!</h1>
          <p className='text-lg'>Please Confirm your details below</p>
        </div>
        <div className="h-96 mx-auto flex flex-col justify-center items-center m-16">
            <div className='basis-1/2 flex flex-col justify-center items-center'>
              <p className='p-2'><span className="font-bold">Name: </span>{location?.state?.name}</p>
              <p className='p-2'><span className="font-bold">Email: </span> {location?.state?.email}</p>
              <p className='p-2 flex flex-col justify-center items-center'><span className="font-bold">Avatar </span> 
                <img className='m-2 border-solid border-2 border-sky-black rounded-full' src={`${location?.state?.picture}`} />
              </p>
              <div className="container flex flex-row w-102 m-3 border-y p-3">
                <p className=" text-gray-700 text-md font-bold mb-2" htmlFor="phoneNo">Enter Phone Number</p>
                <input onChange={handlePhoneChange} className="shadow appearance-none border border-black-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="phoneNo" type="tel" placeholder="123456789"/>
              </div>
              <button className="m-5 w-fit mx-auto bg-Cblue hover:bg-Cdarkblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={createUserHandler} type="button">
                Create Account
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Register