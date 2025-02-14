const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        
        // If no token is provided, return an authentication error
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
            
            // Check if the decoded token contains admin privileges
            if (!decoded.isAdmin) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            
            // Attach the decoded user information to the request object
            req.user = decoded;
            next();
        } catch (err) {
            // If token verification fails, return an invalid token error
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        // Log any unexpected errors and return an authentication failed error
        console.error('Auth middleware error:', err);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};