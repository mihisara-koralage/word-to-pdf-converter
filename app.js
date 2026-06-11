const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {

        if (
            path.extname(file.originalname)
            !== ".docx"
        ) {
            return cb(
                new Error(
                    "Only DOCX files allowed"
                )
            );
        }

        cb(null, true);
    }
});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "index.html")
    );
});

app.post(
    "/upload",
    upload.single("document"),
    (req, res) => {

        console.log(req.file);

        res.send(`
            <h2>Upload Successful!</h2>
            <p>${req.file.originalname}</p>
        `);

    }
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
