import React from 'react'
import { Button } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
function NavbarLogout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
      // if used in more components, this should be in context 
      // axios to /logout endpoint 
      setAuth({});
      localStorage.clear();
      navigate('/login');
  };
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
          </Navbar.Collapse>
          <Button onClick={logout} variant="dark">Logout</Button>
        </Container>
      </Navbar>
    </>
  )
}

export default NavbarLogout
