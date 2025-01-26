import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Signup_img from "./Signup_img";
import validator from "validator";
import axios from "axios";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import NavLogout from "./NavbarLogout";

function Edit() {
  const navigate = useNavigate();
  const [inpval, setInputvalue] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassowrd: "",
  });
  console.log(inpval);
  const [data, setData] = useState([]);
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
    } else if (!password === confirmpassword) {
      alert("Both password field dosen't match");
    }  else {
      console.log(inpval);
      localStorage.setItem("info", JSON.stringify([...data, inpval]));
      navigate("/login");

      axios
        .post(process.env.REACT_APP_localhost_https + "/updateprofile", {
          email: email,
          name: name,
        })
        .then((response) => {
          if (response.data.status === "pending") {
            alert(response.data.message);
          } else {
            alert(response.data.message);
          }
          console.log("Edit Profile connected");
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
      <NavLogout />

      <div className="container mt-3">
        <section className="d-flex justify-content-between">
          <div className="left_data mt-3" style={{ width: "100%" }}>
            <h3 className="text-center col-lg-6">Edit Profile</h3>
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
                  name="Confirmpassword"
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
            
          </div>
        </section>
      </div>
    </>
  );
}

export default Edit;
