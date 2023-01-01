import React from 'react'

import { useNavigate } from 'react-router-dom';
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance';
import useUserStore from '../services/Store';
import Loading from './Loading';

const Profile = () => {
  // Global
  const user = useUserStore(state => state.authUser);
  const loading = useUserStore(state => state.loading);
  const setLoading = useUserStore(state => state.setLoading);

  // Local
  const [profileData, setProfileData] = React.useState({});

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
          const profileReturn = await axiosInstance.get(`/profile/me`, {
              headers: {
                  'x-auth-token': getAuthorizationHeader()
              }
          })

          setProfileData(profileReturn.data);
          setLoading(false);
      } catch (err) {
          console.log(err);
          // alert("Profile is Not Set, Please Create profile");
      }
    }

    fetchData();
  }, [])

  return (
    <div>
      <div className='container mx-auto p-5 text-center text-4xl border-b-2'>
        <h1>My Profile</h1>
        <p className='mt-4 text-slate-500 text-sm'>This profile information will be sent during event registeration to the organization, Please fill it correctly</p>
      </div>
      {loading ? 
      <div className='flex m-4 flex-col justify-center items-center'>
        <Loading/>
      </div>
      : <ProfileCard user={user} profileData={profileData} />}
    </div>
  )
}

const ProfileCard = ({ profileData, user }) => {

  // Toggle Update Profile
  const handleUpdateProfileButton = () => {
    const a = document.getElementById('update-profile').style.display;
    if(a === 'none') {
      document.getElementById('update-profile').style.display = 'block';
    } else {
      document.getElementById('update-profile').style.display = 'none';
    }
  }

  return (
    <div>
    <div className='my-5 p-5 mx-auto container flex flex-col border bg-slate-100 shadow rounded'>
      <p className='p-3 flex flex-col justify-center items-center'>
      <span className='text-slate-600 mr-2'>Avatar </span>
        <img className='m-2 border-solid border-black-4 border-sky-black rounded-full shadow' src={`${user.picture}`} />
      </p>
      <p className='p-1'><span className='text-slate-600 mr-2'>Name: </span> {user.name}</p>
      <p className='p-1'><span className='text-slate-600 mr-2'>Email: </span> {user.email}</p>
      <hr className='my-3'/>
      <p className="p-1">First Name: {profileData.firstname} </p>
      <p className="p-1">Last Name: {profileData.lastname}</p>
      <p className="p-1">Degree: {profileData.degree}</p>
      <p className="p-1">Branch: {profileData.branch}</p>
      <p className="p-1">Year of graudation: {profileData.year}</p>
      <p className="p-1">Roll Number: {profileData.rollno}</p>
      <p className="p-1">Reg Number: {profileData.regno}</p>
      <p className="p-1">Hostel: {profileData.hostel}</p>
      <p className="p-1">LinkedIn Username: <a href={``}>{profileData.linkedinusername}</a></p>
      <p className="p-1">Github Username: <a href={`https://github.com/${profileData.githubusername}`} target='_blank'>{profileData.githubusername}</a></p>
      <button onClick={handleUpdateProfileButton} className="m-5 w-fit mx-auto bg-Cdarkblue hover:bg-Cblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Update Profile
      </button>
    </div>
    <div id='update-profile' style={{display: 'none'}}>
      <ProfileEditCard user={user} profileData={profileData}/> 
    </div>    
    </div>
  )
}

const ProfileEditCard = ({ profileData, user }) => {

  // Local State
  const [profile, setProfile] = React.useState({
    firstname: "",
    lastname: "",
    degree: "",
    branch: "",
    year: "",
    rollno: "",
    regno: "",
    hostel: "",
    linkedinusername: "",
    githubusername: "",
  });

  // Router
  const navigate = useNavigate();

  
  const handleProfileFormChange = (e) => {
    const newProfile = { ...profile };
    newProfile[e.target.name] = e.target.value;
    setProfile(newProfile);
  };

  const handleSubmitProfile = async (e) => {
    try {
      e.preventDefault();

      const editProfile = await axiosInstance.post(
        `profile/`,
        {
          data: {...profile},
          headers: {
            "x-auth-token": getAuthorizationHeader()
          },
        }
      );

      if (editProfile) {
        alert("Profile Edited");
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
      <div>
        <div className='my-5 p-5 mx-auto container flex flex-col border bg-slate-100 shadow rounded'>
          <p className='p-4 text-xl flex flex-col justify-center items-center'>
            Update Profile
          </p>
          <hr className='my-3'/>
          <form method="post" onSubmit={handleSubmitProfile}>
            <div className='m-3'>
            <span className='text-slate-600 mr-2'>First Name: </span>
            <input
              className='border p-2'
              type="text"
              name="firstname"
              placeholder="Enter First Name"
              onChange={handleProfileFormChange}
              defaultValue={profileData.firstname}
              required
            />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Last Name: </span>
              <input 
                className='border p-2'
                type="text"
                name="lastname"
                placeholder="Enter Last Name"
                onChange={handleProfileFormChange}
                defaultValue={profileData.lastname}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Degree: </span>
              <select
                className='border p-2'
                name="degree"
                onChange={handleProfileFormChange}
                defaultValue={profileData.degree}
                required
              >
                <option value="" selected>Choose a degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MSc">MSc</option>
                <option value="BSc">BSc</option>
              </select>
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Branch: </span>
              <select
                className='border p-2'
                name="branch"
                onChange={handleProfileFormChange}
                defaultValue={profileData.degree}
                required
              >
                <option value="" selected>Choose a branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="BIO">BIO</option>
                <option value="META">META</option>
              </select>
            </div>        
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Year of Graduation: </span>
              <input
              className='border p-2'
                type="number"
                name="year"
                placeholder="Enter Year Of Graduation"
                onChange={handleProfileFormChange}
                defaultValue={profileData.year}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Roll Number: </span>
              <input
              className='border p-2'
                type="text"
                name="rollno"
                placeholder="Enter Roll Number"
                onChange={handleProfileFormChange}
                defaultValue={profileData.rollno}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Reg Number: </span>
              <input
              className='border p-2'
                type="text"
                name="regno"
                placeholder="Enter Reg Number"
                onChange={handleProfileFormChange}
                defaultValue={profileData.regno}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Hostel: </span>
              <input
              className='border p-2'
                type="text"
                name="hostel"
                placeholder="Enter Hostel"
                onChange={handleProfileFormChange}
                defaultValue={profileData.hostel}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>LinkedIn Username: </span>
              <input
              className='border p-2'
                type="text"
                name="linkedinusername"
                placeholder="Enter LinkedIn Username"
                onChange={handleProfileFormChange}
                defaultValue={profileData.linkedinusername}
                required
              />
            </div>
            <div className="m-3">
              <span className='text-slate-600 mr-2'>Github Username: </span>
              <input
              className='border p-2'
                type="text"
                name="githubusername"
                placeholder="Enter Github Username"
                onChange={handleProfileFormChange}
                defaultValue={profileData.githubusername}
                required
              />
            </div>
            <input className="m-5 w-fit mx-auto bg-Cdarkblue hover:bg-Cblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Update Profile" type="submit"/>
          </form>
        </div>
      </div>
  )
}

export default Profile