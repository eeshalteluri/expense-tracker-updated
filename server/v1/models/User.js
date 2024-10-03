import mongoose from "mongoose";
const {Schema} = mongoose

import bcrypt from "bcrypt";

import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';

const PersonalExpenseSchema = new Schema({
    expName: {
        type: String,
        required: "Your expense name is required",
        max: 20,
    },
    expAmount: {
        type: String,
        required: "Your expnse amount is required" 
    },
    expDate: {
        type: String,
        required: "Your expense date is required",
    },
    expDescription: {
        type: String,
    }
},
{ timestamps: true })

export const PersonalExpense = mongoose.model("PersonalExpense", PersonalExpenseSchema)

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: "Your firstname is required",
            max: 25,
        },
        lastName: {
            type: String,
            required: "Your lastname is required",
            max: 25,
        },
        email: {
            type: String,
            required: "Your email is required",
            unique: true,
            lowercase: true,
            trim: true,
        },
        userName: {
            type: String,
            required: "Your username is required",
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: "Your password is required",
            max: 25,
        },
        currency: {
            type: String,
            required: "Currency type is required",
            trim: true,
        },
        personalExpenses: [{ type: Schema.Types.ObjectId, ref: 'PersonalExpense' }],
        groupExpenses: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

UserSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
      };
      return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
      });
    };

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

export default mongoose.model("user", UserSchema);

//by setting select: false for password field, we can ensure that password is not included whenever we retrieve data from user's database  
