import React from 'react'
import { axiosInstance, getAuthorizationHeader } from '../services/AxiosInstance'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { Link } from 'react-router-dom'

const Event = () => {
    const {id} = useParams();

    // Local State
    const [item, setPostsData] = React.useState({});
    const [isRegister, setRegister] = React.useState(item.isRegistered);
    const [isLoading, setLoading] = React.useState(false);


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
            setLoading(true);
            try {
                const posts = await axiosInstance.get(`/posts/id/${id}`, {
                    headers: {
                        'x-auth-token': getAuthorizationHeader()
                    }
                })

                
                setPostsData(posts.data);
                setLoading(false);
            } catch (err) {
            console.log(err);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            {isLoading ? (
                <div className="p-5 flex justify-center items-center">
                    <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="loading"/>
                </div>
            ) : (
                <div className='m-5 mx-auto container flex flex-col items-center border bg-slate-100 shadow rounded' id={item._id}>
                    <div className="w-[40rem] bg-white text-gray-700 min-h-full shadow-lg rounded-md overflow-hidden m-16" id={item.cardId}>
                        <h2 className='bg-Cblack p-5 text-white font-semibold text-3xl overflow-ellipsis overflow-hidden whitespace-nowrap'>
                            {item.title}
                        </h2>
                        <img  className="w-fit h-fit object-cover p-4" src={`http://localhost:5000/${item.img}`} />
                        <div className='pt-9 px-5 flex-col divide-y-2'>
                            By <span className='text-2xl font-bold'> {item.user}</span>
                            <div className="flex items-center gap-2"></div>
                        </div>
                        <div className='m-5 flex flex-col justify-center'>
                            
                            <div className='my-4 mx-8 p-5 border text-lg'>
                                <p className='text-sm text-slate-400'>Event Description</p>
                                {item.body}
                            </div>
                            <label className='text-lg pb-2'>Date: <span className='text-red-700'>{moment(item.date).local().format("MMMM Do YYYY, hh:mm a")}</span></label>
                            <label className='my-1'>Venue: <span>{item.venue}</span></label>
                            <label className='my-1'>Duration: <span>{item.duration}</span></label>
                            <label className='my-1'>Registerants: <span>{item.registrants}</span></label>
                        </div>
                        {!isRegister ? (
                            <div className="p-3 bg-red-300 flex flex-row justify-center items-center">
                                {!isRegister ? <button onClick={handleRegister}>Register Now</button> : <button onClick={handleRegister}>UnRegsiter</button>}  
                            </div>  
                        ) : (
                            <div className='text-center'>
                                
                                <div className="p-3 bg-green-300 flex flex-row justify-center items-center">
                                    <div>
                                        Thank you for registering 🎉, Here is the whatsapp link for the event
                                        <p><a href={item.waLink} className='text-xl text-green-800'>{item.waLink}</a></p>
                                    </div>  
                                </div> 
                                {console.log(item)}
                            </div>
                        )}

        
                    </div>
                </div>
            )}

        </div>
            
  )
}

export default Event