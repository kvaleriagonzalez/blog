const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require('../api/models/User');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");

const uri = "mongodb://localhost:27017/blog";
// server.js
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dbname';
const PORT = process.env.PORT || '8080';

app.use(express.json());
// server.js at the very end of the file.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./build'));
    // only add this part if you are using React Router
    app.get('*', (req,res) =>{
        console.log(path.join(__dirname+'/build/index.html'));
        res.sendFile(path.join(__dirname+'/build/index.html'));
    });
}

mongoose
  .connect(uri)
  .then(() => {
    console.log(`Successfully connected to: ${uri}`);
  })
  .catch((err) => console.log(err.message));

  const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

// test if localhost:4000 is connected

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


app.listen("5000", () => {
    console.log("back end is running");
});

