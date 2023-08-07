
const userService = require("../services/user.service")

const fetchUserData = async (req, res, next) => {
    const user = req.user

    if (!user) {
        req.flash('alert', JSON.stringify({ "message": "Something Went Very wrong please login again", "status": "error" }));
        res.redirect('/user/login');
        return;
    }

    const userInformation = await userService.findOne({ _id: user._id });

    if (!userInformation) {
        req.flash('alert', JSON.stringify({ "message": "Something Went Very wrong please login again", "status": "error" }));
        res.redirect('/user/login');
        return;
    }

    req.user = userInformation
    next()
}


module.exports = fetchUserData