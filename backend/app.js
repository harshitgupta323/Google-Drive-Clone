const express = require("express");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const mongoose = require("./mongoose");
var cors = require("cors");
const path = require("path");
const https = require("https");
const fs = require("fs");
const app = express();
const fileRoutes = require("./routes/fileUploadRoutes");
const verifyJWT = require("./verifyJWT");
const cookieParser = require("cookie-parser");
const { fileShare } = require("./controllers/fileshareController");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //15min
  max: 1000, // limit each IP to 5 request
  message: "Too many API requests from this IP, please try again after 15min.",
});

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.post("/sendForVerify", mongoose.sendDocumentForVerification);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/signup", mongoose.createUser); //signup routedyu
app.post("/signin", mongoose.signInUser);

app.use(limiter);

app.post("/getdocs", mongoose.getAllDocuments);


app.get("/download", mongoose.downloadDocument);

app.post("/getdocbyId", mongoose.getDocumentsbyId);

app.post("/signup", mongoose.createUser); //signup route
app.post("/signin", mongoose.signInUser);
app.post("/updateprofile", mongoose.updateProfile);
app.post("/sharefile", fileShare);
app.use("/api", fileRoutes.routes); //      /api/uploadsinglefile

app.delete("/deleteDocument", mongoose.deleteDocument);

const sslserver = https.createServer(
  {
    key: fs.readFileSync("./certificate/localhost-key.pem"),
    cert: fs.readFileSync("./certificate/localhost.pem"),
  },
  app
);
// app.listen(3001);
sslserver.listen(3001, () => console.log("secure server  on port 3001"));
// app.listen(3001);

