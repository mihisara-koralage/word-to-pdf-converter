exports.sanitizeFilename =
(fileName) => {

    return fileName
        .replace(/[^a-zA-Z0-9.-]/g, "_");

};