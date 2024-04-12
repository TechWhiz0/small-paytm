const { jwtSecret } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
   

    if (!authHeader) {
        return res.status(403).json({ error: 'Unauthorized' });
        // Return immediately if Authorization header is missing or invalid
    }
    const token = authHeader;
    // console.log(token);
    try {
        const decoded = jwt.verify(token, jwtSecret);

        // Check if decoded token contains userId
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next(); // Proceed to the next middleware
        } else {
            return res.status(403).json({ error: 'Unauthorized' });
            // Return unauthorized response if userId is missing or invalid
        }
    } catch (ex) {
        console.error('JWT Verification Error:', ex);
        return res.status(403).json({ error: 'Unauthorized' });
        // Return unauthorized response on token verification failure
    }
};

module.exports = {
    authMiddleware,
};
