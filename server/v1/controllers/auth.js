import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Cookies from "js-cookie"

import User from "../models/User.js";
import Blacklist from "../models/blacklist.js"

import {SECRET_ACCESS_TOKEN} from "../config/index.js"

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Signup(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { firstName, lastName, email, userName, currency, password } = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            firstName,
            lastName,
            email,
            userName,
            currency,
            password
        });
        // Check if user already exists
        const existingEmail = await User.findOne({ email });
        console.log(existingEmail)
        if (existingEmail)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        
        const existingUserName = await User.findOne({ userName });
        if (existingUserName)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Username already taken. Try another username.",
            });
            
        const savedUser = await newUser.save(); // save new user into the database
        const {role, ...user_data } = savedUser._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}

export async function Signin (req, res) {

    const {email} = req.body
try{
    const isExistingUser = await User.findOne({email}).select("+password")
    console.log("isexistingUser: ", isExistingUser)

    if(!isExistingUser){
        return res.status(401).json({
            status: "failed",
            data: [],
            message:
                "Invalid email. Please try again with the correct credentials.",
        })
    }
    console.log(req.body.password)

   const isPasswordValid = await bcrypt.compare(req.body.password, isExistingUser.password)
   console.log(isPasswordValid)

   if(!isPasswordValid){
    return res.status(401).json({
        status: "failed",
        data: [],
        message:
            "Invalid Password. Please try again with the correct credentials.",
    })
}

// return user info except password
const { password, ...user_data } = isExistingUser._doc;
console.log(user_data)

let options = {
    maxAge: 2 * 60 * 1000, // would expire in 20minutes
    httpOnly: false, // The cookie is only accessible by the web server
    secure: true,
    sameSite: "None",
};
const token = isExistingUser.generateAccessJWT(); // generate session token for user
res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
res.status(200).json({
    status: "success",
    message: "You have successfully logged in.",
});

} catch (err) {
res.status(500).json({
    status: "error",
    code: 500,
    data: [],
    message: "Internal Server Error",
});
}
res.end();

}

export const Logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('authHeader: ', authHeader); // get the session cookie from request header
        if (!authHeader) {
            return res.sendStatus(204); // no content
        }
        const cookie = authHeader.split(' ')[1];
        console.log('cookie: ', cookie); // If there is, split the cookie string to get the actual jwt token
        const checkIfBlacklisted = await Blacklist.findOne({ token: cookie });
        console.log('checkIfBlacklisted: ', checkIfBlacklisted);
        // if true, send a no content response
        if (checkIfBlacklisted) {
            return res.sendStatus(204);
        }
        // otherwise, blacklist the token
        const newBlacklist = new Blacklist({
            token: cookie,
        });
        console.log('newBlacklist before: ', newBlacklist);
        await newBlacklist.save();
        console.log('newBlacklist after: ', newBlacklist);

        // also clear request cookie on client
        res.setHeader('Clear-Site-Data', "cookies");
        Cookies.remove('sessionID', { req, res });

        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        console.error(err); // Improved error logging
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};
