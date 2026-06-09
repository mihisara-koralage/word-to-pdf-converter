const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Word-to-PDF Converter");
});

app.get("/about", (req, res) => {
  res.send("This app converts Word documents to PDF");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
