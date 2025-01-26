import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Signup_img from "./Signup_img";
import axios from "axios";
import "react-phone-number-input/style.css";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const { setAuth } = useAuth();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [inpval, setInputvalue] = useState({
    email: "",
    password: ""
  });
  console.log(inpval);
  const getdata = (e) => {
    const { value, name } = e.target;
    setInputvalue(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const addData = (e) => {
    e.preventDefault();
    console.log(inpval);
    const getarr = localStorage.getItem("info");
    console.log(getarr);
    const { email, password } = inpval;

    if (email === "") {
      alert("Email field is required");
    } else if (!email.includes("@")) {
      alert("Please enter valid email address");
    } else {
      console.log("sending post request");
      axios
        .post(process.env.REACT_APP_localhost_https + "/signin", {
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response);
          if (response.data.status === "success") {
            // alert(response.data.message);
            console.log("user login successfuly");

            
              const accessToken = response.data.accessToken;
              const a = { email, accessToken };
              localStorage.setItem("auth", JSON.stringify(a));
              navigate("/uploadfile", {
                state: {
                  userId: email,
                  accessToken: response.data.accessToken,
                },
              });
          } else {
            alert(response.data.message);
          }
          // console.log("SignIn connected");
        })
        .catch((err) => {
          console.error(err);
          if (
            err.response.data ===
            "Too many API requests from this IP, please try again after 15min."
          ) {
            navigate("/IPLimiter");
          }
        });
    }
  };
  return (
    <>
      <div className="container mt-3">
        <section className="d-flex justify-content-between">
          <div className="left_data mt-3" style={{ width: "100%" }}>
            <h3 className="text-center col-lg-6">Sign In</h3>
            <Form method="POST">
              <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  name="email"
                  onChange={getdata}
                  placeholder="Enter email"
                />
              </Form.Group>

              
              <Form.Group
                className="mb-3 col-lg-6"
                controlId="formBasicPassword"
              >
                <Form.Control
                  type="password"
                  name="password"
                  onChange={getdata}
                  placeholder="Password"
                />
              </Form.Group>

              <Button
                variant="primary"
                className="col-lg-6"
                onClick={addData}
                style={{ background: "rgb(67,185,127)" }}
                type="submit"
              >
                Submit
              </Button>
            </Form>
            <p className="mt-3">
              Already have an Account
              <span>
                <NavLink to={"/Home"}>SignUp</NavLink>{" "}
              </span>
            </p>
          </div>
          <Signup_img/>
        </section>
      </div>
    </>
  );
};

export default Login;
