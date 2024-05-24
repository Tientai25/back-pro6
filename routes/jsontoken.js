const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (typeof token !== "undefined") {
        jwt.verify(token, process.env.secretKey, (err, decoded) => {
            if (err) {
                res.status(403).send("Invalid token");
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        res.status(401).send("Unauthorized");
    }
}

module.exports = verifyToken;
