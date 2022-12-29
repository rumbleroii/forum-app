import React from 'react'

import { useNavigate } from 'react-router-dom';
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance';

const Profile = () => {

  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileData, setProfileData] = React.useState({});

  React.useEffect(() => {
    async function fetchData() {
      try {
          const profileReturn = await axiosInstance.get(`/profile/me`, {
              headers: {
                  'x-auth-token': getAuthorizationHeader()
              }
          })

          setProfileData(profileReturn.data);
          console.log(profileData);
      } catch (err) {
          console.log(err);
          // alert("Profile is Not Set, Please Create profile");
      }
    }

    fetchData();
  }, [])

  return (
    <div>
      <h1>My Profile</h1>
      <br/>
      <ProfileCard profileData={profileData} />
    </div>
  )
}

const ProfileCard = ({ profileData }) => {
  return (
    <div className="postCard">
      <ul>
        <li>Firstname: {profileData.firstname} </li>
        <li>LastName: {profileData.lastname}</li>
        <li>Degree: {profileData.degree}</li>
        <li>Branch: {profileData.branch}</li>
        <li>Year of graudation: {profileData.year}</li>
        <li>Roll Number: {profileData.rollno}</li>
        <li>Reg Number: {profileData.regno}</li>
        <li>Hostel: {profileData.hostel}</li>
        <li>
          LinkedIn Username: <a href={``}></a>{profileData.linkedinusername}</li>
        <li>
          Github Username: <a href={`https://github.com/${profileData.githubusername}`} target='_blank'>{profileData.githubusername}</a>
        </li>
      </ul>
      <br />
      <ProfileEditCard profileData={profileData}/>
    </div>

   
  )
}

const ProfileEditCard = ({ profileData }) => {

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
      console.log(profile);

   

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
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
      <div>
        <form method="post" onSubmit={handleSubmitProfile}>
          <h1>Create / Edit Progile</h1>
          <br />
          <div className="field">
            <label>First Name: </label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter First Name"
              onChange={handleProfileFormChange}
              defaultValue={profileData.firstname}
            />
          </div>
          <div className="field">
            <label>Last Name: </label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter Last Name"
              onChange={handleProfileFormChange}
              defaultValue={profileData.lastname}
            />
          </div>
          <div className="field">
            <label>Degree: </label>
            <input
              type="text"
              name="degree"
              placeholder="Enter Degree"
              onChange={handleProfileFormChange}
              defaultValue={profileData.degree}
            />
          </div>
          <div className="field">
            <label>Branch: </label>
            <input
              type="text"
              name="branch"
              placeholder="Enter Branch"
              onChange={handleProfileFormChange}
              defaultValue={profileData.branch}
            />
          </div>        
          <div className="field">
            <label>Year Of Graduation: </label>
            <input
              type="text"
              name="year"
              placeholder="Enter Year Of Graduation"
              onChange={handleProfileFormChange}
              defaultValue={profileData.year}
            />
          </div>
          <div className="field">
            <label>Roll No: </label>
            <input
              type="text"
              name="rollno"
              placeholder="Enter Roll Number"
              onChange={handleProfileFormChange}
              defaultValue={profileData.rollno}
            />
          </div>
          <div className="field">
            <label>Reg No: </label>
            <input
              type="text"
              name="regno"
              placeholder="Enter Reg Number"
              onChange={handleProfileFormChange}
              defaultValue={profileData.regno}
            />
          </div>
          <div className="field">
            <label>Hostel: </label>
            <input
              type="text"
              name="hostel"
              placeholder="Enter Hostel"
              onChange={handleProfileFormChange}
              defaultValue={profileData.hostel}
            />
          </div>
          <div className="field">
            <label>LinkedIn Username: </label>
            <input
              type="text"
              name="linkedinusername"
              placeholder="Enter LinkedIn Username"
              onChange={handleProfileFormChange}
              defaultValue={profileData.linkedinusername}
            />
          </div>
          <div className="field">
            <label>GitHub Username: </label>
            <input
              type="text"
              name="githubusername"
              placeholder="Enter Github Username"
              onChange={handleProfileFormChange}
              defaultValue={profileData.githubusername}
            />
          </div>
          <div className="field">
            <input type="submit" name="submit" />
          </div>
        </form>
      </div>
  )
}

export default Profile