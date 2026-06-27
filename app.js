require("dotenv").config();
const express =
    require("express");

const path =
    require("path");

const fs =
    require("fs");

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const documentRoutes =
    require(
        "./routes/documentRoutes"
    );

const app =
    express();

const limiter = rateLimit({

    windowMs:
        15 * 60 * 1000,

    max: 20,

    message:
        "Too many requests. Try again later."

});

app.use(limiter);

fs.mkdirSync(
    "uploads",
    { recursive: true }
);

fs.mkdirSync(
    "outputs",
    { recursive: true }
);


app.use(
    express.static("public")
);


app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "index.html"
        )
    );

});

app.use(helmet());
app.use(morgan("combined"));


app.use(
    "/",
    documentRoutes
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

        res.download(
            filePath
        );

    }
);

app.use(
    (
        err,
        req,
        res,
        next
    ) => {

        console.error(err);

        res.status(500).send(`
        <h1>Error</h1>

        <p>${err.message}</p>

        <a href="/">
            Back to Home
        </a>
        `);

    }
);

app.use((req, res) => {

    res.status(404).send(`
        <h1>404</h1>

        <p>Page not found</p>

        <a href="/">
            Home
        </a>
    `);

});

const PORT =
    process.env.PORT || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);

