function authorize(role) {
    return function (req, res, next) {
        if (req.user.role !== role)
            return res.send("Unauthorized");

        next();
    };
}

module.exports = authorize;