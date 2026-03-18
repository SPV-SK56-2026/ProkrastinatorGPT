const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        // Verify the token using secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user's ID to the request
        req.userData = decoded;
        
        next(); // Move to the next function 
    } catch (error) {
        return res.status(401).json({ message: 'Avtentikacija ni uspela' });
    }
};