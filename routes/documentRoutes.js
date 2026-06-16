const path = require("path");

const express =
    require("express");

const router =
    express.Router();

const upload =
    require(
        "../middleware/uploadMiddleware"
    );

const {
    uploadDocument
} = require(
    "../controllers/convertController"
);

router.post(
    "/upload",
    upload.single("document"),
    uploadDocument
);

router.get("/success", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views", "success.html")
    );
});

module.exports = router;