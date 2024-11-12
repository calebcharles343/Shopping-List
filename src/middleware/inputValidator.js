import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .regex(/^[A-Za-z\s]+$/) // Allows alphabetic characters and spaces
    .required()
    .messages({
      "string.pattern.base":
        "Name must contain only alphabetic characters and spaces",
      "string.empty": "Name is required",
      "string.min": "Name should have at least 3 characters",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password should have at least 8 characters",
    "string.empty": "Password is required",
  }),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),

  role: Joi.string().min(4),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });

  next();
};

export default validateUser;
