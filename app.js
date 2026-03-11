const express = require("express");
const mongoose = require("mongoose");

const stuffRoutes = require("./routes/stuff");
const authRoutes = require("./routes/user");

const app = express();
// mongodb+srv://koumagnonandy490:<db_password>@cluster2.1feqdrk.mongodb.net/?appName=Cluster2
mongoose
  .connect(
    "mongodb+srv://mahugnon:BgjOlFFrziWT7qir@cluster2.1feqdrk.mongodb.net/?appName=Cluster2",
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => {
    console.log("Connexion à MongoDB échouée !");
    // console.error(err);
    // Very usefull to log the error details for debugging, but be careful not to log sensitive information in production environments.
  });

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use("/images", express.static("images"));

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
