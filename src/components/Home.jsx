import React from 'react'
import useUserStore from '../services/Store'
import axios from 'axios';
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance';

import moment from 'moment';

import { Link } from 'react-router-dom';

const Home = () => {
  // Global State
  const user = useUserStore(state => state.authUser);

  // Local State
  const [postsData, setPostsData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    setLoading(true);
    async function fetchData() {
        try {
            const posts = await axiosInstance.get('/posts', {
                headers: {
                    'x-auth-token': getAuthorizationHeader()
                }
            })

            setLoading(false);
            setPostsData(posts.data);
        } catch (err) {
            console.log(err.response.data.msg);
        }

    }

    fetchData();
  },[])

    return (
        <div>
            Welcome to home <strong>{user?.name}</strong>
            {loading ? <p>Loading...</p> : null }
            <br/>
            <br/>
            {postsData.map((item) => {
                return <Posts key={item._id} item={item} />
            })}
        </div>
    )
}

const Posts = ({ item }) => {

    const [isLiked, setLike] = React.useState(item.isLiked);

    const handleLike = async () => {
        const like = await axiosInstance.put(`/posts/like/${item._id}`, {
            headers: {
                'x-auth-token': getAuthorizationHeader()
            }
        })

        return setLike(isLiked ? false : true);
    }

    return (
        <div className="postCard" id={item.cardId}>
            <ul>
                <li>
                    <h1><Link to={`/event/${item._id}`}>{item.title}</Link></h1>
                    <h1>Organization: {item.organization}</h1>
                </li>
                <li>_id: {item._id} </li>
                <li>Body: {item.body}</li>
                <li>Likes: { item.likes }</li>
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

                {console.log(item)}
                {isLiked ? <button onClick={handleLike} style={{ color: 'green' }}><strong>Liked!!</strong></button> : <button onClick={handleLike} style={{ color: 'red' }}><strong>Like Now!</strong></button>}    
            </ul>
            <br />         
        </div>
    )
}

export default Home