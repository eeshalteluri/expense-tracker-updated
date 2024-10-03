import express from "express";
import { Signup, Signin, Logout } from "../controllers/auth.js";
import Validate from "../middlewares/validate.js";
import { check } from "express-validator";

const router = express.Router();

// Register route -- POST request
router.post(
    "/signup",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("firstName")
        .not()
        .isEmpty()
        .withMessage("You first name is required")
        .trim()
        .escape(),
    check("lastName")
        .not()
        .isEmpty()
        .withMessage("You last name is required")
        .trim()
        .escape(),
    check("userName")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Must be at least 6 chars long"),
    check("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 chars long"),
    Validate,
    Signup
);

router.post('/signin',
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 chars long"),
        Validate,
        Signin
)

router.get('/logout', Logout)

export default router;