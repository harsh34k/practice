const JWT = require("jsonwebtoken");
const User = require("../models/User");
const secret = "$superMan@123";

function createTokenForUser(user) {
    const paylod = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageUrl,
        phoneNumber: user.phoneNumber,
        role: user.role,
    }
    const token = JWT.sign(paylod, secret);
    return token;
}

function validateToken(token) {
    if (!token) {
        return null
    }
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (error) {
        console.log("error", error);
        return null; // Token is invalid, return null
    }

    return payload;
}
module.exports = { createTokenForUser, validateToken };