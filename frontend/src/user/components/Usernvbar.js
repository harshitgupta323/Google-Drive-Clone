import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import SearchPage from "./SearchPage";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Usernvbar = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const { setAuth } = useAuth();
  const { auth } = useAuth();

  const a = JSON.parse(localStorage.getItem("auth"));
  const history = useNavigate();
  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    localStorage.clear();
    history("/login");
  };
  history(0);
  const onSubmit = (e) => {
    history.push(`?s=${searchQuery}`);
    e.preventDefault();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">User Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href={"/userdashboard"}>Search</Nav.Link>
              <Nav.Link href={"/uploadfile"}>My Files</Nav.Link>
              <Nav.Link href="#action2">Edit</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Button onClick={logout} variant="dark">
            Logout
          </Button>
        </Container>
      </Navbar>
      <p></p>
      <SearchPage />
    </>
  );
};

export default Usernvbar;
