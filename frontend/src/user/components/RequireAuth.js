import React, { useEffect, useState } from "react";

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Child({ auth, allowedRoles }) {
  const location = useLocation();
  console.log(4);
  return auth?.menu ? (
    allowedRoles.includes(auth.menu) ? (
      <Outlet />
    ) : auth?.email ? (
      <Navigate to="/details" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

const RequireAuth = ({ allowedRoles }) => {
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  // setFlag(false);

  const { setAuth } = useAuth();
  const { auth } = useAuth();
  const a = JSON.parse(localStorage.getItem("auth"));
  const value = {
    email: a.email,
    menu: a.menu,
    accessToken: a.accessToken,
  };
  // if(!auth){

  //     setAuth(value);
  // }

  console.log("inside Req auth");
  // console.log(a.email);
  console.log(1);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("auth")))
      setAuth(JSON.parse(localStorage.getItem("auth")));
    console.log(2);
    setFlag(true);
  }, []);
  // console.log("Require Auth"+auth.email);
  console.log(3);
  return <div>{flag && <Child auth={auth} allowedRoles={allowedRoles} />}</div>;
};

export default RequireAuth;
