import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
    console.log("validation1")
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    console.log("Validation Completed.")
    next();
};
export default Validate;