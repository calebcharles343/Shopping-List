import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { catchAsync } from "../utls/catchAsync.js";
import { AppError } from "../utls/appError.js";
import sendMail from "../utls/sendmail.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // This should be '1d' or another valid format
  });
};

/*////////////////////////////////////// */
/*////////////////////////////////////// */

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const changedPasswordAfterToken = (req, res, next) => {
  const { password_changed_at } = req.user;
  const JWTTimestamp = req.user.iat; // The token's issued timestamp

  if (password_changed_at) {
    const changedTimestamp = parseInt(
      new Date(password_changed_at).getTime() / 1000,
      10
    );
    if (JWTTimestamp < changedTimestamp) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  // If no password change or token is still valid, proceed
  next();
};

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    return next(new AppError("Passwords do not match", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = role || "user"; // Default to 'user' if role is not provided

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, userRole]
  );

  createSendToken(newUser.rows[0], 201, res);
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userResult.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 1) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2) Check if user still exists
  const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    decoded.id,
  ]);
  const currentUser = userResult.rows[0];

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // Attach the user and token issued time to the request for future use
  req.user = currentUser;
  req.user.iat = decoded.iat;

  next();
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const forgotPassword = catchAsync(async (req, res, next) => {
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    req.body.email,
  ]);
  const user = userResult.rows[0];

  console.log(user.email);

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now, in ISO format

  await pool.query(
    "UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3",
    [hashedToken, resetExpires, req.body.email]
  );

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      userMail: user.email,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    await pool.query(
      "UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE email = $1",
      [req.body.email]
    );

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */ 5;

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Convert current time to ISO format for PostgreSQL compatibility
  const currentTime = new Date().toISOString();

  const userResult = await pool.query(
    "SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > $2",
    [hashedToken, currentTime]
  );
  const user = userResult.rows[0];

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await pool.query(
    "UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL, password_changed_at = NOW() + INTERVAL '1 second' WHERE id = $2",
    [hashedPassword, user.id]
  );

  createSendToken(user, 200, res);
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */

export const updatePassword = catchAsync(async (req, res, next) => {
  const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);
  const user = userResult.rows[0];

  if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Update password and set `password_changed_at` to current time
  await pool.query(
    "UPDATE users SET password = $1, password_changed_at = NOW() WHERE id = $2",
    [hashedPassword, req.user.id]
  );

  createSendToken(user, 200, res);
});

/*////////////////////////////////////// */
/*////////////////////////////////////// */

/*
export const updatePassword = catchAsync(async (req, res, next) => {
  const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);
  const user = userResult.rows[0];

  if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Update password and set `password_changed_at` to current time
  await pool.query(
    "UPDATE users SET password = $1, password_changed_at = NOW() WHERE id = $2",
    [hashedPassword, req.user.id]
  );

  createSendToken(user, 200, res);
});
*/
