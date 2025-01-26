import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Signup_img from "./Signup_img";
import validator from "validator";
import axios from "axios";
import "react-phone-number-input/style.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);


  const [inpval, setInputvalue] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  console.log(inpval);
  const validate = (value) => {
    if (
      !validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      alert("Is Not Strong Password");
      return true;
    }
  };
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
    const { name, email, password, confirmpassword } =
      inpval;

    if (name === "") {
      alert("Name filed is required");
    } else if (email === "") {
      alert("Email field is required");
    } else if (!email.includes("@")) {
      alert("Please enter valid email address");
    } else if (validate(password)) {
      alert("Please enter password");
    } else if (!(password === confirmpassword)) {
      alert("Both password field dosen't match");
    } else {
      console.log(inpval);
      localStorage.setItem("info", JSON.stringify([...data, inpval]));
      navigate("/login");
      axios
        .post(process.env.REACT_APP_localhost_https + "/signup", {
          name: name,
          email: email,
          password: password,
          //file: file,
        })
        .then((response) => {
          if (response.data.status === "pending") {
            alert(response.data.message);
          } else {
            alert(response.data.message);
          }
          console.log("SignIn Successfully Email verification Required");
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
            <h3 className="text-center col-lg-6">Sign Up</h3>
            <Form method="POST">
              <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  name="name"
                  onChange={getdata}
                  placeholder="Enter Your Name"
                />
              </Form.Group>

              <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  name="email"
                  onChange={getdata}
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-3 col-lg-6">
                <Form.Control
                  type="tel"
                  name="phnnumber"
                  onChange={getdata}
                  placeholder="Mobile Number"
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

              <Form.Group
                className="mb-3 col-lg-6"
                controlId="formBasicConfirmPassword"
              >
                <Form.Control
                  type="password"
                  name="confirmpassword"
                  onChange={getdata}
                  placeholder="Confirm Password"
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
              Already have an Account{" "}
              <span>
                <NavLink to={"/login"}>SignIn</NavLink>{" "}
              </span>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
