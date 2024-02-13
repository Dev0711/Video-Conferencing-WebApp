function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];
    const authToken = tokenHeader && tokenHeader.split(' ')[1]
    if (!tokenHeader) {
        return res.status(403).redirect('/');
    }

    jwt.verify(authToken, process.env.ACCESS_TOKEN, (err) => {
        if (err) {
            return res.status(401).send('Failed to authenticate token');
        }

        next();
    });
}

export default verifyToken