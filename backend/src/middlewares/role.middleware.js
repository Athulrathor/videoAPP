import ApiError from "../utils/ApiError.js";

export const authorizeRole = (...roles) => {
    return (req,res,next) => {
        if (!req.user) {
            throw new ApiError(401,'Not authenticated.');
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403,`Access denied. Required role: ${roles.join(' or ')}.`);
        }

        next();
    }
}