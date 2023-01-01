import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { axiosInstance, getAuthorizationHeader } from "../services/AxiosInstance";

import moment from "moment";

const EditPost = () => {

  // Local State
  const [details, setDetails] = React.useState({
    title: "",
    body: "",
    picPath: "",
    duration: "",
    venue: "",
    date: "",
    waLink: "",
  });

  // Router
  const navigate = useNavigate();
  const { state } = useLocation();

  
  const handleChange = (e) => {
    const newDetails = { ...details };
    if (e.target.name === "picPath") {
      newDetails[e.target.name] = e.target.files[0];
    } else {
      newDetails[e.target.name] = e.target.value;
    }
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(details);

      const newFormData = new FormData();

      newFormData.append("image", details.picPath);
      newFormData.append("postDetails", JSON.stringify(details));

      const editPost = await axiosInstance.put(
        `posts/${state.id}`,
        newFormData,
        {
          headers: {
            "x-auth-token": getAuthorizationHeader()
          },
        }
      );

      if (editPost) {
        alert("Post Edited");
        navigate("/panel");
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
          <div className='container mx-auto p-5 text-center text-4xl border-b-2'>
            Edit Event
          </div>
          <hr className='my-3'/>
          <div className='my-5 p-5 mx-auto container flex flex-col border bg-slate-100 shadow rounded'>
            <form
              className="createPostForm"
              encType="multipart/form-data"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="m-3">
                <span className='text-lg text-slate-600 mr-2'>Title: </span>
                <input
                  className='border p-2'
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  onChange={handleChange}
                  defaultValue={state.title}
                />
              </div>
              <div className="m-3">
                <textarea
                  className="border p-2 shadow"
                  id="body"
                  name="body"
                  rows="4"
                  cols="50"
                  placeholder="Enter Event Body"
                  onChange={handleChange}
                  defaultValue={state.body}
                ></textarea>
              </div>
              <div className="m-3">
              <span className='text-lg text-slate-600 mr-2'>Upload Image: </span>
                <input
                  className='border p-2'
                  type="file"
                  name="picPath"
                  placeholder="Enter pic path"
                  onChange={handleChange}
                />
              </div>
              <div className="m-3">
                <span className='text-lg text-slate-600 mr-2'>Duration: </span>
                <input
                  className='border p-2'
                  type="text"
                  name="duration"
                  placeholder="Enter duration"
                  onChange={handleChange}
                  defaultValue={state.duration}
                />
              </div>
              <div className="m-3">
                <span className='text-lg text-slate-600 mr-2'>Venue: </span>
                <input
                  className='border p-2'
                  type="text"
                  name="venue"
                  placeholder="Enter venue"
                  onChange={handleChange}
                  defaultValue={state.venue}
                />
              </div>
              <div className="m-3">
                <span className='text-lg text-slate-600 mr-2'>Date: </span>
                <input
                  className='border p-2'
                  type="datetime-local"
                  name="date"
                  placeholder="Enter title"
                  onChange={handleChange}
                  defaultValue={moment(state.date)
                    .local()
                    .format("YYYY-MM-DDTkk:mm")}
                />
              </div>
              <div className="m-3">
                <span className='text-lg text-slate-600 mr-2'>WhatsApp Link: </span>
                <input
                  className='border p-2'
                  type="text"
                  name="waLink"
                  placeholder="Enter the waLink"
                  onChange={handleChange}
                  defaultValue={state.waLink}
                />
              </div>
              <input className="m-5 w-fit mx-auto bg-Cdarkblue hover:bg-Cblue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Submit" type="submit"/>
            </form>
        </div>
      </div>
  );
};

export default EditPost;
