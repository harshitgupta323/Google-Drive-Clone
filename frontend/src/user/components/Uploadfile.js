import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Uploadfile = () => {
  const { auth } = useAuth();
  const [record, setRecord] = useState([]);
  const [record2, setRecord2] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const logout = async () => {
    setAuth({});
    localStorage.clear();
    navigate("/login");
  };

  const location = useLocation();
  const email = location.state.userId;
  const [inpval, setInputvalue] = useState({
    shareemail: "",
  });

  const getdata = (e) => {
    const { value, name } = e.target;
    setInputvalue(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const [hpid, setHpid] = useState("");
  const getData = () => {
    console.log("Access token new " + inpval.email);
    fetch(process.env.REACT_APP_localhost_https + "/getdocs", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jwttoken: auth.accessToken,
        email: email,
      }),
    })
      .then((resposne) => resposne.json())
      .then((res) => {
        if (res.status === "sessionfailed") {
          alert("Session failed !!! please logout and login again..");
          setAuth({});
          localStorage.clear();
          navigate("/login");
        }
        const arr_verified = [];
        const arr_pending = [];
        for (let i = 0; i < res.docs.length; i++) {
          if (res.docs[i].fileVerifiedStatus == true) {
            res.docs[i].fileVerifiedStatus = "Verified";
            arr_verified.push(res.docs[i]);
          } else {
            res.docs[i].fileVerifiedStatus = "Pending";
            arr_pending.push(res.docs[i]);
          }
        }
        setRecord(arr_pending);
        setRecord2(arr_verified);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  
  let datasize = record.length;

  useEffect(() => {
    getData();
  }, []);
  
  const [file, setFile] = useState();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const url = process.env.REACT_APP_localhost_https + "/api/uploadsinglefile";
    const formData = new FormData();

    if (file == null) alert("Choose file first :)");
    
    else {
      formData.append("email", email);
      formData.append("file", file);
      axios.post(url, formData).then((response) => {
        console.log(response.data);
        alert("Upload success... Please refresh!!");
      });
    }
  }

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
              <Nav.Link href={"/uploadfile"}>My Files</Nav.Link>
              <Nav.Link href={"/EditProfile"}>Edit</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Button onClick={logout} variant="dark">
            Logout
          </Button>
        </Container>
      </Navbar>
      <p></p>

      <div class="col main  mt-3 ">
        
        <div
          class="alert alert-warning fade collapse"
          role="alert"
          id="myAlert"
        >
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
          <strong>Data and Records</strong> Learn more about employee
        </div>

        <div class="text-uppercase center ">
          <form onSubmit={handleSubmit}>
            <h5 class="mt-3 mb-3 text-secondary">
              Upload Document
            </h5>
            <input type="file" name="file" onChange={handleChange} />
            <Button variant="secondary" type="submit">
              Upload
            </Button>
          </form>
        </div>



        <br></br>

        <div class="row mb-3 center">
          <div class="col-xl-3 col-sm-6 py-2">
            <div class="card bg-success text-white h-100">
              <div
                class="card-body bg-success"
                style={{ backgroundColor: "#57b960" }}
              >
                <div class="rotate">
                  <i class="fa fa-user fa-4x"></i>
                </div>
                <h6 class="text-uppercase">Total Number of Documents</h6>
                <h1 class="display-4">{datasize}</h1>
              </div>
            </div>
          </div>
        </div>

        
        <hr />

        <div class="row center">
          <div class="col-lg-10 col-md-6 col-sm-12">
            <h5 class="mt-3 mb-3 text-secondary">DOCUMENTS</h5>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead class="thead-light">
                  <tr>
                    <th>Document Name</th>
                    <th>Document Type</th>
                    <th>Download</th>
                    <th>Delete</th>
                    <th>Share with</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {record.map((output) => (
                    <tr>
                      <td>{output.fileName}</td>
                      <td>{output.fileType}</td>
                      {/* button to download file */}
                      <td dataField="button">
                        <Button
                          onClick={() => {
                            // download the file to user
                            const downloadFilename = output.fileName;
                            const downloadFilePath = output.filePath;
                            axios({
                              url:
                                process.env.REACT_APP_localhost_https +
                                "/download",
                              method: "GET",
                              responseType: "blob",
                              params: {
                                download_filepath: downloadFilePath,
                              },
                            }).then((res) => {
                              console.log(res);
                              const fileformat = res.data.type.split("/")[1];

                              fileDownload(
                                res.data,
                                output.fileName + "." + fileformat
                              );
                            });
                          }}
                          variant="warning"
                        >
                          Download File
                        </Button>
                      </td>
                      {/* button to delete */}
                      <td dataField="button">
                        <Button
                          onClick={() => {
                            const docId = output._id;
                            console.log(docId);
                            axios
                              .delete(
                                process.env.REACT_APP_localhost_https +
                                  "/deleteDocument",
                                {
                                  data: {
                                    docId: docId,
                                  },
                                }
                              )
                              .then((response) => {
                                console.log(response);
                                if (response.data.status === "success") {
                                  alert(response.data.message);
                                } else {
                                  alert(response.data.message);
                                }
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                          }}
                          variant="danger"
                        >
                          Delete file
                        </Button>
                      </td>

                      <td>
                        <Form method="POST">
                          <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                            <Form.Control
                              type="email"
                              name="shareemail"
                              onChange={getdata}
                              placeholder="Enter email"
                            />
                          </Form.Group>
                        </Form>
                      </td>

                      <td>
                        <Button
                          onClick={() => {
                            console.log("share email"+inpval.shareemail);
                            console.log("Doc Id " + output._id);
                            if (inpval.shareemail === "")
                              alert("Please enter a valid email");
                            else {
                              const data = {
                                
                                fileName: output.fileName,
                                filePath: output.filePath,
                                fileType: output.fileType,
                                fileVerifiedStatus: false,
                                fileSize: output.fileSize,
                                fileUserid: inpval.shareemail,
                                fileIPaddress: "192.168.54.4",
                              };
                              const url = process.env.REACT_APP_localhost_https + "/sharefile";
                                console.log(output);
                                axios.post(url, data).then((response) => {
                                  console.log(response.data);
                                  alert("File shared!!");
                                });
                            }
                          }}
                          variant="success"
                        >
                          Share
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Uploadfile;
