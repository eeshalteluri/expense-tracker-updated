import User from "../models/User.js";
import Blacklist from "../models/blacklist.js";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";

export async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["authorization"]; // get the session cookie from request header

        console.log("AuthHeader: ", authHeader)
        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split(" ")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie

        console.log('cookie: ', cookie)// If there is, split the cookie string to get the actual jwt token
        const checkIfBlacklisted = await Blacklist.findOne({token: cookie})
        console.log('checkIfBlacklisted: ', checkIfBlacklisted)

        // Check if that token is blacklisted
        if(checkIfBlacklisted){
            return res.status(401)
            .json({message: "This session has expired. Please Login"})
        }
        
        jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            console.log('decoded: ', decoded)
            const { id } = decoded; // get user id from the decoded token
            const user = await User.findById(id);
            console.log("user: ", user) // find user by that `id`
            const { password, ...data } = user._doc; // return user object without the password
            req.user = user; // put the data object into req.user
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
