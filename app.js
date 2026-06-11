const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
    res.send("Word to PDF Converter Project");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
