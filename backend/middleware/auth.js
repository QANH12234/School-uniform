const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // Allow guest access
            req.user = { 
                id: 'guest',
                name: 'Guest User',
                email: 'guest@example.com',
                role: 'guest'
            };
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = {
                ...decoded,
                id: decoded.id || decoded._id // Handle both id formats
            };
            next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            // If token is invalid, use guest access
            req.user = { 
                id: 'guest',
                name: 'Guest User',
                email: 'guest@example.com',
                role: 'guest'
            };
            next();
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        // In case of any error, still allow guest access
        req.user = { 
            id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            role: 'guest'
        };
        next();
    }
};

module.exports = auth; 