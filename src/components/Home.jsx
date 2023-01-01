import React from 'react'

import useUserStore from '../services/Store'
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance';
import moment from 'moment';
import { Link } from 'react-router-dom';

import Loading from './Loading';



const Home = () => {

  // Global State
  const user = useUserStore(state => state.authUser);
  const loading = useUserStore(state => state.loading);
    const setLoading = useUserStore(state => state.setLoading);
 
  // Local State
  const [postsData, setPostsData] = React.useState([]);
  const [isError, setError] = React.useState({
    errorStatus: false,
    errorMsg: ""
  });


  React.useEffect(() => {

    setLoading(true);

    async function fetchData() {
        try {
            const posts = await axiosInstance.get('/posts', {
                headers: {
                    'x-auth-token': getAuthorizationHeader()
                }
            })

            setPostsData(posts.data);
            setLoading(false);
        } catch (err) {
            console.log(err.response.data.msg);
            return setError({errorStatus: true, errorMsg: err.response.data.msg});
        }
    }

    fetchData();
  },[])

    return (
        <div>
            <div className='bg-black p-4 shadow divide-y-8 mb-8 sticky top-0'>
                <span className='text-white text-xl'>Welcome <strong className='text-2xl'>{user?.name}</strong>, See whats happening in campus!</span>
            </div>

            <div className='flex flex-col justify-center items-center'>
                {loading ? <Loading/> : null }

                {postsData.map((item) => {
                    return <Posts key={item._id} item={item} setPostsData={setPostsData} postsData={postsData} loading={loading} setLoading={setLoading}/>
                })}
            </div>
        </div>
    )
}

const Posts = ({ item, loading, setLoading  }) => {

    const [isLiked, setLike] = React.useState({
        likeStatus: item.isLiked,
        likeCount: item.likes
    });

    const handleLike = async () => {
        setLoading(true);
        try {
            await axiosInstance.put(`/posts/like/${item._id}`, {
                headers: {
                    'x-auth-token': getAuthorizationHeader()
                }
            }) 
            
            setLoading(false);
            if(isLiked.likeStatus == false) {
                return setLike({likeStatus: true, likeCount: isLiked.likeCount + 1});
            } else {
                return setLike({likeStatus: false, likeCount: isLiked.likeCount - 1});
            }
        } catch (err) {
            console.log(err.response.data.msg);
            return setError({errorStatus: true, errorMsg: err.response.data.msg});
        }
        
    }

    return (
        <div className='m-2 container flex flex-col items-center border bg-slate-100 shadow rounded' id={item._id}>
            <div className="w-[40rem] bg-white text-gray-700 min-h-full shadow-lg rounded-md overflow-hidden m-8" id={item.cardId}>
                <h2 className='bg-Cblack p-5 text-white font-semibold text-3xl overflow-ellipsis overflow-hidden whitespace-nowrap'>
                    {item.title}
                </h2>
                <div className='bg-slate-700 p-2 overflow-ellipsis overflow-hidden shadow whitespace-nowrap'>
                    <label className='m-3 text-white text-lg'><span className='text-white-700'>{moment(item.date).local().format("MMMM Do YYYY, hh:mm a")}</span></label>
                </div>
                <img  className="w-fit h-fit object-cover p-4" src={`http://localhost:5000/${item.img}`} />
                <div className='pt-3 px-5 flex-col divide-y-2'>
                    By <span className='text-2xl font-bold'> {item.user}</span>
                    <div className="flex items-center gap-2"></div>
                </div>
                <div className='m-5 flex flex-col justify-center'>
                    {/* <div className='my-4 mx-8 p-5 text-lg border'>
                        <p className='text-slate-400'>Event Description</p>
                        {item.body}
                    </div> */}
                    {/* <label className='text-lg pb-2'>Date: <span className='text-red-700'>{moment(item.date).local().format("MMMM Do YYYY, hh:mm a")}</span></label> */}
                    <div className='mt-5 w-full flex justify-center items-center gap-3'>
                        { loading ? <Loading/> : null }
                        { isLiked.likeStatus ? 
                            <div>  
                                <button onClick={handleLike} className='flex gap-1 bg-red-200 rounded border p-1'>
                                <strong>Unlike</strong>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                                    </svg>
                                </button> 
                            </div>
                            : 
                            <div>
                                <button onClick={handleLike} className='flex gap-1 bg-green-200 rounded border p-1'>
                                <strong>Like</strong>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                    </svg>
                                </button>
                            </div>
                        }  
                        {isLiked.likeCount}
                    </div>
                </div>
                <div className="p-3 bg-green-400 flex flex-row justify-center items-center">
                <Link to={`/event/${item._id}`}>Click Here To Register Now!</Link>
                </div>          
            </div>
        </div>
        
    )
}

export default Home