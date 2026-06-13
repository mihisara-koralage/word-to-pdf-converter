const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

fs.mkdirSync("uploads", { recursive: true });
fs.mkdirSync("outputs", { recursive: true });

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
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

      const ext =
        path.extname(
            file.originalname
        ).toLowerCase();

      if (ext !== ".docx") {

        return cb(
            new Error(
                "Only DOCX files are allowed."
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

	if (!req.file) {
    		return res.status(400).send(
        	"No file uploaded"
    		);
	}

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
	    <!DOCTYPE html>
        <html>
        <head>
            <title>Success</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background: #111318;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .container {
                    max-width: 600px;
                    width: 100%;
                    margin: 100px auto;
                    background: #1e2028;
                    padding: 40px;
                    text-align: center;
                    border-radius: 16px;
                    border: 1px solid #2e3140;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                }

                h1 {
                    margin-bottom: 20px;
                    color: #e2e8f0;
                    letter-spacing: 0.5px;
                    font-size: 24px;
                }

                p {
                    color: #94a3b8;
                    margin-bottom: 24px;
                    font-size: 15px;
                }

                a {
                    display: inline-block;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                a.primary {
                    background: #e2e8f0;
                    color: #111318;
                    margin-bottom: 12px;
                }

                a.primary:hover {
                    background: #cbd5e1;
                }

                a.secondary {
                    background: #1e2028;
                    color: #94a3b8;
                    border: 1.5px solid #3b4255;
                }

                a.secondary:hover {
                    background: #1e2130;
                    border-color: #64748b;
                    color: #e2e8f0;
                }
            </style>
        </head>
        <body>

            <div class="container">
                <h1>Conversion Successful</h1>

                <p>Your PDF is ready.</p>

                <a href="/downloads/${pdfName}" class="primary">
                    Download PDF
                </a>

                <br><br>

                <a href="/" class="secondary">
                    Convert Another File
                </a>
            </div>

        </body>
        </html>
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

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).send(`
        <h1>Error</h1>

        <p>${err.message}</p>

        <a href="/">
            Go Back
        </a>
    `);

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
