const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const { convertToPdf } =
require("./controllers/convertController");

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
    async (req, res) => {

        try {

            const uploadedFile =
                req.file.path;

            const pdfName =
                Date.now() + ".pdf";

            const outputPath =
                "outputs/" + pdfName;

            await convertToPdf(
                uploadedFile,
                outputPath
            );

	    fs.unlinkSync(uploadedFile);

            res.send(`
                <h2>Conversion Successful</h2>

                <a href="/downloads/${pdfName}">
                    Download PDF
                </a>
            `);

        } catch (error) {

            console.error(error);

            res.status(500).send(
                "Conversion failed"
            );

        }

    }
);

app.get(
    "/downloads/:file",
    (req, res) => {

        const filePath =
            path.join(
                __dirname,
                "outputs",
                req.params.file
            );

        res.download(filePath);

    }
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
