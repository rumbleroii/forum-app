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
      <div>
        <div className='container mx-auto p-5 text-center text-4xl border-b-2'>
          <h1>Your Posts</h1>
        </div>
        {postsData.map((item, i) => {
          return (
            <Posts key={item} cardId={i} {...item} handleDeletePost = {handleDeletePost}/>
          );
        })}
      </div>
  );
};

const Posts = (props) => {
  console.log(props);
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
      <div className='mt-5 mx-auto container flex flex-col items-center border bg-slate-100 shadow rounded' id={props._id}>
            <div className="w-[40rem] bg-white text-gray-700 min-h-full shadow-lg rounded-md overflow-hidden mx-16 mt-16 mb-5" id={props.cardId}>
                <h2 className='bg-Cblack p-5 text-white font-semibold text-3xl overflow-ellipsis overflow-hidden whitespace-nowrap'>
                    {props.title}
                </h2>
                <img  className="w-fit h-fit object-cover p-4" src={`http://localhost:5000/${props.img}`} />
                <div className='m-5 flex flex-col justify-center'>
                    <div className='my-4 mx-8 p-5 border text-lg'>
                        <p className='text-sm text-slate-400'>Event Description</p>
                        {props.body}
                    </div>
                    <label className='text-lg pb-2'>Date: <span className='text-red-700'>{moment(props.date).local().format("MMMM Do YYYY, hh:mm a")}</span></label>
                    <div className='mt-5 w-full'>
                    Likes:  {props.likes}
                    </div>
                    <div className='mt-5 w-full'>
                    Registrants:  {props.registrants}
                    </div>
                    <div className='mt-5 w-full'>
                    Duration:  {props.duration}
                    </div>
                    <div className='mt-5 w-full'>
                    Venue:  {props.venue}
                    </div>
                    <div className='mt-5 w-full'>
                    WhatsApp Link:  {props.waLink}
                    </div>
                    <div className='mt-5 w-full'>
                    Updated:  {props.updated.toString()}
                    </div>

                </div>      
            </div>
            <div className="flex gap-3">
              <button className="m-3 w-fit mx-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete") === true) return props.handleDeletePost(props._id);
                  }}
                >
                Delete Post
              </button>
              <button className="m-3 w-fit mx-auto bg-Cdarkblue hover:bg-Cblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={editButtonHandler}>Edit Post</button>
              <button className="m-3 w-fit mx-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={downloadButtonHandler}>Download Registrants</button>  
            </div>
            
        </div>
      
  );
};

export default Home;
