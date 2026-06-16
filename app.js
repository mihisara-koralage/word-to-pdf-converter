const express =
    require("express");

const path =
    require("path");

const fs =
    require("fs");

const documentRoutes =
    require(
        "./routes/documentRoutes"
    );

const app =
    express();


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

        res.status(500)
           .send(err.message);

    }
);

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

