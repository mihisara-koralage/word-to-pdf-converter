const fs = require("fs");
const libre = require("libreoffice-convert");

exports.convertToPdf = async (inputPath, outputPath) => {

    const file = fs.readFileSync(inputPath);

    const pdfBuffer = await new Promise((resolve, reject) => {

        libre.convert(
            file,
            ".pdf",
            undefined,
            (err, done) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(done);
                }

            }
        );

    });

    fs.writeFileSync(outputPath, pdfBuffer);

};
