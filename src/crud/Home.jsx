import React from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance, getAuthorizationHeader } from "../services/AxiosInstance";
import useUserStore from "../services/Store";

import download from 'downloadjs';
import moment from "moment";


const Home = () => {
  // Global State
  const user = useUserStore(state => state.authUser);
    
  // Local States
  const [postsData, setPostsData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    async function fetchData () {
      try {
        const posts = await axiosInstance.get("posts/org", {
          headers: {
            "x-auth-token": getAuthorizationHeader()
          },
        });
  
        setLoading(false);
        setPostsData(posts.data);
      } catch (err) {
        console.log(err.response.data.msg);
      }
    };

    fetchData();
  }, [])

  const handleDeletePost = async(id) => {
    try {
      await axiosInstance.delete(`posts/${id}`,
        {
          headers: {
            "x-auth-token": getAuthorizationHeader()
          },
        }
      );

      // Filtering it out
      const newPostsData = postsData.filter((item) => item._id != id);
      setPostsData(newPostsData);

    } catch (err) {
      console.log(err.response.data.msg);
    }
  }

  
  return (
      <div className="home">
        <h1> Your Posts </h1>
        {postsData.map((item, i) => {
          return (
            <Posts key={item} cardId={i} {...item} handleDeletePost = {handleDeletePost}/>
          );
        })}
      </div>
  );
};

const Posts = (props) => {
  const navigate = useNavigate();

  //Edit Button Handler
  const editButtonHandler = () => {
    navigate("/panel/edit", {
      state: {
        id: props._id,
        title: props.title,
        body: props.body,
        picPath: props.img,
        duration: props.duration,
        venue: props.venue,
        date: props.date,
        waLink: props.waLink,
      },
    });
  };

  const downloadButtonHandler = async () => {
    const res = await axiosInstance.get(`posts/download/${props._id}`, {
      headers: {
        "x-auth-token": getAuthorizationHeader()
      },
    }) 

    return download(res.data, props.title+".csv");
  }
  

  return (
    <div className="postCard" id={props.cardId}>
      <ul>
        <li>
          <h1>Organization: {props.organization}</h1>
        </li>
        <li>Title: {props.title}</li>
        <li>Body: {props.body}</li>
        <li>Likes: {props.likes}</li>
        <li>Registrants: {props.registrants}</li>
        <li>
          Pic <img src={`http://localhost:5000/${props.img}`} />
        </li>
        <li>Is Updated: {props.updated.toString()}</li>
        <li>Venue: {props.venue}</li>
        <li>
          Date: {moment(props.date).local().format("MMMM Do YYYY, hh:mm a")}
        </li>
        <li>Duration: {props.duration}</li>
        <li>WhatsApp Link: {props.waLink}</li>
      </ul>
      <br />
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete") === true) return props.handleDeletePost(props._id);
        }}
      >
        Delete Post
      </button>
      <button onClick={editButtonHandler}>Edit Post</button>
      <button onClick={downloadButtonHandler}>Download Registrants</button>
    </div>
  );
};

export default Home;
