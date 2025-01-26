const mongoose = require("mongoose");
const User = require("./models/userDetails");
const singleDocuments = require("./models/singlefile");
const userTokens = require("./models/usertokens");
const healthcareProfessionals = require("./models/healthcareProfessionals");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
var fs = require('fs');
//jwt
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://ritul:ritul123@cluster0.ecwzof7.mongodb.net/cloud-project-db?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });


const createUser = async (req, res, next) => {
  

  const createdUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    jwttoken: "",
  });
  var dir = './uploads/'+req.body.email;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  const result = await createdUser.save(function (err, returnedData) {
    console.log("Record saved");
  });


};



const sendVerficationEmail = ({ _id, email }, res) => {
  const currentURL = "http:/localhost/";
  const uniqueString = uuidv4() + _id;
  console.log("1 reached");
  const saltNumber = 8;
  bcrypt
    .hash(uniqueString, saltNumber)
    .then((hashedString) => {
      console.log("String Hashed" + hashedString);
      const newuserVerfication = new UserVerification({
        userId: _id,
        uniqueString: hashedString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });
      newuserVerfication
        .save()
        .then(() => {
          console.log("record saved");
        })
        .catch(() => {
          console.log("Record NOT saved");
        });
    })
    .catch(() => {
      res.json({
        status: "Failed",
        message: "An error occured hasing data!! ",
      });
    });
};

//LOGIN
const signInUser = async (req, res, next) => {
  console.log("hello");
  if (!req.body.email) {
    res.status(406).json({ err: "You have to fill the email no hacking:)" });
    return;
  }
  if (!req.body.email.includes("@gmail")) {
    res
      .status(406)
      .json({ err: "You have to fill the genuine email no hacking:)" });
    return;
  }
  if (!req.body.password) {
    res.status(406).json({ err: "You have to fill the password no hacking:)" });
    return;
  }

  const email = req.body.email;
  const password = req.body.password;

  if (email == "" || password === "") {
    res.json({
      status: "failed",
      message: "Empty field not allowed retry!!!!",
    });
  }
  User.find({ email: email })
    .then((result) => {
      if (true) {
        const hashedPassword = result[0].password;

        bcrypt
          .compare(password, hashedPassword)
          .then((cmp_result) => {
            if (cmp_result) {
              const accessToken = jwt.sign(
                { username: email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1500s" }
              );
              const refreshToken = jwt.sign(
                { username: email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "900s" }
              );

              User.updateOne({ email: email }, { jwttoken: accessToken })
                .then((response1) => {
                  console.log("token saved in user !!!");
                })
                .catch((err) => {
                  console.log("error saving token!!");
                });

              const newusertokens = new userTokens({
                email: email,
                accesstoken: accessToken,
                refreshtoken: refreshToken,
              });
              newusertokens
                .save()
                .then((response1) => {
                  console.log("token saved !!!");
                })
                .catch((err) => {
                  console.log("error saving token!!");
                });
              res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
              });
              res.json({
                status: "success",
                message: "Password Matched !!!!",
                accessToken: accessToken,
              });

            } else {
              console.log("ID PASSWORD NOT MATCHED !!!!");
              res.json({
                status: "failed",
                message: "Wrong Password!! Login Failed !!!!",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
       } 
    })
    .catch((error) => {
      console.log("USER NOT FOUND!!! ENTER VALID EMAIL ADDRESS!!! ");
      res.json({
        status: "failed",
        message: "Email Id Not Found  !!!!",
      });
    });
};

const getAllDocuments = async (req, res, next) => {
  const email = req.body.email;
  const request_token = req.body.jwttoken;

  console.log("email is : " + email);

  User.find({ email: email,
    
  })
    .then((result) => {
      const token_retrived = result[0].jwttoken;
      const token_incoming = request_token;
      console.log("token_retrived : " + token_retrived);
      console.log("token_incoming : " + token_incoming);
      if (true) {
        console.log("token Matched in this request");
        singleDocuments
          .find()
          .where("fileUserid")
          .equals(email)
          .then((allDocs) => {
            res.json({
              status: "Success fething all doucuments",
              docs: allDocs,
            });
          })
          .catch((err2) => {
            res.json({
              status: "Failed",
              message: "failed to fetch docs",
            });
          });
      } else {
        console.log("token did not match in this request");
        res.json({
          status: "sessionfailed",
          message: "failed to fetch docs..please sign IN",
        });
      }
    })
    .catch((err) => {
      console.log("error in checktoken validity, in catch..");
    });
};

const getDocumentsbyId = async (req, res, next) => {
  const allDocs = await singleDocuments
    .find(
      {
        _id: { $in: req.body },
      },

      function (err, docs) {
        console.log(docs);
      }
    )
    .exec();
  res.json({
    status: "Success fething all doucuments",
    docs: allDocs,
  });
};


const sendDocumentForVerification = async (req, res, next) => {
  console.log("inside send doc"+req.body.hpId);


    User.find({ email: req.body.hpId })
    .then((result) => {
      if (true) {
        const hashedPassword = result[0].password;
        console.log("share mail id:"+result[0]);
       } 
    })
    .catch((error) => {
      console.log("USER NOT FOUND!!! ENTER VALID EMAIL ADDRESS!!! ");
      res.json({
        status: "failed",
        message: "Email Id Not Found  !!!!",
      });
    });
};

const downloadDocument = async (req, res, next) => {
  try {
    const filepath = req.query.download_filepath;
    const file = `${__dirname}/` + filepath;
    console.log(file);
    res.download(file);
  } catch (err) {
    console.log(err);
  }
};

const deleteDocument = async (req, res, next) => {
  let docId = req.body.docId;
  console.log(docId);
  singleDocuments
    .deleteOne({ _id: docId })
    .then(() => {
      console.log("Doc Deleted in backend!!" + docId);
      res.json({
        status: "success",
        message: "Doc Deleted Successfully !!",
      });
    })
    .catch((error) => {
      console.log("Doc Deletion failed somehow!!");
      res.json({
        status: "failed",
        message: "Doc Deletion  Failed !!",
      });
    });
};



const updateProfile = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;

  User.updateOne(
    { email: email },
    {
      name: name
    }
  )
    .then((result) => {
      console.log("Profile update Success in backend!!");
      res.json({
        status: "success",
        message: "Profile update Verfication Success !!",
      });
    })
    .catch((error) => {
      console.log("Profile update Verfication Failed !!");
      res.json({
        status: "failed",
        message: "Profile update Verfication Failed !!",
      });
    });
};


exports.createUser = createUser;
exports.signInUser = signInUser;
exports.getAllDocuments = getAllDocuments;
exports.downloadDocument = downloadDocument;
exports.deleteDocument = deleteDocument;
exports.updateProfile = updateProfile;
exports.getDocumentsbyId = getDocumentsbyId;
exports.sendDocumentForVerification = sendDocumentForVerification;