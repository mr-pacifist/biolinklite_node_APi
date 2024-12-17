const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 10, 
    delayMs: 1000, 
    handler: function (req, res) {
        res.status(429).json({ message: "Too many requests, please try again later." });
    }
});

module.exports = limiter;
