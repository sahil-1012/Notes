const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt-secret';


const fetchuser = (req, res, next) => {

    // GET THE USER FROM THE JWT TOKEN AND ADD ID TO REQUESTED OBJECT
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please Authenticate to using a Valid Token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: error.message });
    }

}

module.exports = fetchuser;