import React from 'react'
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance'
import { useParams } from 'react-router-dom'
import moment from 'moment'

const Event = () => {
    const {id} = useParams();
    const [item, setPostsData] = React.useState({});
    
    const [isRegister, setRegister] = React.useState(item.isRegistered);


    // Update Register Button
    React.useEffect(() => {
        setRegister(item.isRegistered);
    }, [item, setPostsData])

    const handleRegister = async () => {
        await axiosInstance.put(`/posts/register/${id}`, {
            headers: {
                'x-auth-token': getAuthorizationHeader()
            }
        })

        if(isRegister === false) setRegister(true);
        if(isRegister === true) setRegister(false);
    }


    // Fetch data
    React.useEffect(() => {
        async function fetchData() {
            try {
                const posts = await axiosInstance.get(`/posts/id/${id}`, {
                    headers: {
                        'x-auth-token': getAuthorizationHeader()
                    }
                })

                console.log(posts.data);
                setPostsData(posts.data);
            } catch (err) {
            console.log(err);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="postCard" id={item.cardId}>
            <ul>
                <li>
                    <h1>Organization: {item.organization}</h1>
                </li>
                <li>Title: {item.title}</li>
                <li>_id: {item._id} </li>
                <li>Body: {item.body}</li>
                <li>Likes: {item.likes}</li>
                <li>Registrants: {item.registrants}</li>
                <li>
                    Pic <img src={`http://localhost:5000/${item.img}`} />
                </li>
                <li>Venue: {item.venue}</li>
                <li>
                    Date: {moment(item.date).local().format("MMMM Do YYYY, hh:mm a")}
                </li>
                <li>Duration: {item.duration}</li>
                <li>WhatsApp Link: {item.waLink}</li>
            </ul>
            {!isRegister ? <button onClick={handleRegister}>Register</button> : <button onClick={handleRegister}>UnRegsiter</button>}   
            <br />
        </div>
  )
}

export default Event