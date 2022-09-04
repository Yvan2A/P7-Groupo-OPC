const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require('dotenv').config();


const postsRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

mongoose
  .connect(
    "mongodb+srv://Yvan2A:Choucroute@cluster0.ia7uiht.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/post", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

