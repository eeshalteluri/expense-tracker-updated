import User, { PersonalExpense } from "../models/User.js";
import Blacklist from "../models/blacklist.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Cookies from "js-cookie"

import { SECRET_ACCESS_TOKEN } from "../config/index.js";
import { Logout } from "./auth.js";
import getCookie from "../middlewares/getCookie.js";

export const homeDashboard = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).populate("personalExpenses");

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      currency: user.currency,
      personalExpenses: user.personalExpenses,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPersonalExpense = async (req, res) => {
  try {
    const { _id, __v, email, createdAt, updatedAt, ...data } = req.user;
    const { expName, expAmount, expDate, expDescription } = req.body;

    const personalExpense = new PersonalExpense({
      expName,
      expAmount,
      expDate,
      expDescription,
    });
    await personalExpense.save();

    const userUpdate = await User.findByIdAndUpdate(
      _id,
      {
        $push: { personalExpenses: personalExpense._id },
      },
      { new: true }
    );

    res.end();
  } catch (error) {
    console.log(error);
  }
};

export const updatePersonalExpense = async (req, res) => {
  try {
    const { id, expName, expAmount, expDate, expDescription } = req.body;
    console.log(id);

    const expenseUpdate = await PersonalExpense.updateOne(
      { _id: id },
      {
        $set: {
          expName,
          expAmount,
          expDate,
          expDescription,
        },
      }
    );

    console.log("expense(backend) updated successfully!!");
    res.end();
  } catch (error) {
    console.log(error);
  }
};

export const deletePersonalExpense = async (req, res) => {
  try {
    const user = req.user;
    console.log("user: ", user);

    const expenseId = req.body.id;
    console.log("expenseId: ", expenseId);

    const user_id = user._id;
    console.log("user_id: ", user_id);

    const isExistingUser = await User.findById(user_id);
    console.log("isExistingUser: ", isExistingUser);

    await User.findByIdAndUpdate(
      { _id: user_id },
      { $pull: { personalExpenses: expenseId } }
    );

    await PersonalExpense.findByIdAndDelete(expenseId)

    console.log("Expense deleted successfully!!");

    res.end();
  } catch (error) {
    console.log(error);
  }
};

export const completeUserDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("userDetailsCookie: ", authHeader);

    const cookie = authHeader.split(" ")[1];

    await jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }

      console.log("decoded: ", decoded);
      const { id } = decoded; // get user id from the decoded token
      const user = await User.findById(id);
      console.log("user: ", user); // find user by that `id`

      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        currency: user.currency,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  
  const { firstName, lastName, userName, email, currency } = req.body;
  const updatedUser = { firstName, lastName, userName, email, currency }

  const authHeader = req.headers["authorization"];
  console.log("updateUserDetailsCookie: ", authHeader);

    const cookie = authHeader.split(" ")[1];

    await jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }

      console.log("decoded: ", decoded);
      const { id } = decoded; // get user id from the decoded token

      try {
        const existingUser = await User.findById(id).select("+password");
        console.log("isexistingUser: ", existingUser);

        const { firstName, lastName, userName, email, currency, ...rest } = existingUser
        const mainUserDetails = { firstName, lastName, userName, email, currency }
    
        if (!existingUser) {
          return res.status(401).json({
            status: "failed",
            data: [],
            message: "user doesnot exist.",
          });
        }
        console.log(req.body.password);
    
        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          existingUser.password
        );
        console.log("updated user passwordValid: ", isPasswordValid);
    
        if (!isPasswordValid) {
          return res.status(401).json({
            status: "failed",
            data: [],
            message: "Invalid Password. Please try again with the correct credentials.",
          });
        }

        console.log(mainUserDetails, updatedUser)
        console.log(JSON.stringify(mainUserDetails) === JSON.stringify(updatedUser))

        if(JSON.stringify(mainUserDetails) === JSON.stringify(updatedUser)){
          return res.status(405)
          .json({message: 'You didnot update any fields. Your details are same as before.'})
        }

        console.log(userName)
        console.log(existingUser.userName)
        console.log(email)
        console.log(existingUser.email)
        console.log(userName != existingUser.userName )
        console.log(email != existingUser.email )

        if(updatedUser.userName != existingUser.userName){
          const userAlreadyExists = await User.findOne({userName: updatedUser.userName})

          if(userAlreadyExists){
            return res.status(405)
            .json({message: 'Username already taken. Try another!!'})
          }
        }

        if(updatedUser.email != existingUser.email){
          const userAlreadyExists = await User.findOne({email: updatedUser.email})

          if(userAlreadyExists){
            return res.status(405)
            .json({message: 'Email you are trying to change to already in use.'})
          }
        }

        await User.findByIdAndUpdate(existingUser._id, updatedUser, { new: true });
    
        if (email !== existingUser.email || userName !== existingUser.userName) {
            console.log('Changed unique credentials.')
            
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
        }
    
        res.end()
      } catch (error) {
        console.log(error);
      }
    })
  
};
