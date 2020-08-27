const jwt = require('jsonwebtoken');

module.exports = {
    async authenticateToken(request, response, next) {
        const authHeader = request.headers['authorization']
        const [scheme, token] = authHeader && authHeader.split(' ');

        if (token === null) return response.status(401).json({ error: 'No token provided' });

        if (!/^Bearer$/i.test(scheme))
            return response.status(401).json({ error: 'Token badformatted' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err) return response.status(403).json({ error: 'Invalid authorization token' });

            next();
        });
    }
}