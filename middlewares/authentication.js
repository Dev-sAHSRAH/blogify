const { validateToken } = require("../services/authentication");
const cookieParser = require("cookie-parser");

function checkForAutheticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {}
        next();
    };
}

module.exports = {
    checkForAutheticationCookie,
};
