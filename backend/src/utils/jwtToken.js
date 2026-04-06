import jwt from 'jsonwebtoken';

export const generateAccessToken = (id,tokenVersion,role,sessionId) => {
    return jwt.sign(
          {
            id: id,
            tokenVersion: tokenVersion,
            role: role,
            sessionId: sessionId,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
}

export const generateRefreshToken = (id,tokenVersion,sessionId) => {
    return jwt.sign(
        {
            id: id,
            tokenVersion: tokenVersion,
            sessionId: sessionId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}