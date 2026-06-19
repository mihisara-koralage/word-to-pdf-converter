const multer = require("multer");
const path = require("path");
const {
    sanitizeFilename
} = require("../utils/sanitizeFilename");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(
            null,
            path.join(
                __dirname,
                "../uploads"
            )
    );
},

    filename: (req, file, cb) => {

        const safeName =
            sanitizeFilename(
                file.originalname
            );

        cb(
            null,
            Date.now() + "-" + safeName
    );

}

});

const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const ext =
            path.extname(file.originalname)
                .toLowerCase();

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

module.exports = upload;