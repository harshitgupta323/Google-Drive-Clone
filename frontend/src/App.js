import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./user/components/Home";
import { Routes, Route} from "react-router-dom";
import Login from "./user/components/Login";
import Uploadfile from "./user/components/Uploadfile";
import Signup_img from "./user/components/Signup_img";
import EditProfile from "./user/components/EditProfile";
import IPLimiter from "./user/components/IPLimiter";
import Layout from "./user/components/Layout";
import NavLogout from "./user/components/NavbarLogout";

const App = () => {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/IPLimiter" element={<IPLimiter />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/details" element={<Details />} /> */}
          <Route path="/uploadfile" element={<Uploadfile />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/uploadfile" element={<Uploadfile />} />
            <Route path="/NavLogout" element={<NavLogout />} />

        </Route>
      </Routes>
    </>
  );
};
export default App;
