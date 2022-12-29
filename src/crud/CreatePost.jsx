import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance, getAuthorizationHeader } from "../services/AxiosInstance";

const CreatePost = () => {

  // local State
  const [details, setDetails] = useState({
    title: "",
    body: "",
    picPath: "",
    duration: "",
    venue: "",
    date: "",
  });

  // Global State
  const navigate = useNavigate();


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

      console.log(newFormData.get("postDetails"));

      const createPost = await axiosInstance.post(
        "/posts",
        newFormData,
        {
          headers: {
            "x-auth-token": getAuthorizationHeader()
          },
        }
      );

      if (createPost) {
        alert("Post Created");
        navigate("/panel");
      }

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
      <div className="createPostDiv">
        <form
          className="createPostForm"
          encType="multipart/form-data"
          method="post"
          onSubmit={handleSubmit}
        >
          <h1>Create a new Event</h1>
          <br />
          <div className="field">
            <label>Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="field">
            <label>Body: </label>
            <textarea
              id="body"
              name="body"
              rows="4"
              cols="50"
              onChange={handleChange}
            ></textarea>
          </div>
          <br />
          <div className="field">
            <label>Upload Post: </label>
            <input
              type="file"
              name="picPath"
              placeholder="Enter pic path"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="field">
            <label>Duration: </label>
            <input
              type="text"
              name="duration"
              placeholder="Enter duration"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="field">
            <label>Venue: </label>
            <input
              type="text"
              name="venue"
              placeholder="Enter venue"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="field">
            <label>Date: </label>
            <input
              type="datetime-local"
              name="date"
              placeholder="Enter title"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className="field">
            <label>WhatsApp Link: </label>
            <input
              type="text"
              name="waLink"
              placeholder="Enter the waLink"
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <input type="submit" name="submit" />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
