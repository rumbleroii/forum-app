import { Routes, Route } from "react-router-dom";

import CreatePost from "./CreatePost"
import EditPost from "./EditPost";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";

const AppPanel = () => {
  return (
    <Routes>
        <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<CreatePost />} />
        <Route path="/edit" element={<EditPost />} />
      </Route>
    </Routes>
  );
};

export default AppPanel;
