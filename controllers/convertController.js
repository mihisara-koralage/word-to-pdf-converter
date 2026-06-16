const path = require("path");

const {
    convertToPdf
} = require(
    "../services/pdfService"
);

exports.uploadDocument =
async (req, res) => {

    try {

        if (!req.file) {

            return res
                .status(400)
                .send(
                    "No file uploaded"
                );

        }

        const uploadedFile =
            req.file.path;

        const pdfName =
            Date.now() + ".pdf";

        const outputPath =
            path.join(
                "outputs",
                pdfName
            );

        await convertToPdf(
            uploadedFile,
            outputPath
        );

        res.redirect(`/success?file=${pdfName}`);
        
    } catch (error) {

        console.error(error);

        res.status(500)
           .send(
             "Conversion failed"
           );

    }

};