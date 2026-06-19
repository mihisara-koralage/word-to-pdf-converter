const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Upload limit exceeded."
});

module.exports = uploadLimiter;