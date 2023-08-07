require('dotenv').config()
const jwt = require('jsonwebtoken');


// Define middleware to authenticate user with JWT
const authenticate = (req, res, next) => {
    const token = req.cookies.token

    // console.log("1 "+ req.cookies('token'));
    // console.log("2 "+req.cookie['token']);


    // console.log(token);



    if (!token) {
        // throw an error that something went wrong
        console.error("no token found");

        res.redirect('/user/login')
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/user/login')
    }
};

module.exports = authenticate;