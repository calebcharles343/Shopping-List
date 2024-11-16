import express from "express";
import {
  deleteUser,
  getAllInactiveUsers,
  getAllUsers,
  getUserById,
  updateMe,
} from "../controllers/userController.js";
import validatorUser from "../middleware/inputValidator.js";
import {
  changedPasswordAfterToken,
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "../controllers/authController.js";

const userRouter = express.Router();

/*//////////////////////*/
/*AUTHENTICATION ROUTE*/
/*//////////////////////*/
//These are special end points that do not 100% fit the rest philosophy

/*//////////////////////*/
userRouter.post("/signup", validatorUser, signup);
userRouter.post("/login", login);
userRouter.post("/forgotPassword", forgotPassword);

/*
resetPassword is a patch requet because we a modifying the\ 
password property of the user document
*/
userRouter.patch("/resetPassword/:token", resetPassword);

userRouter.patch("/updatePassword", protect, updatePassword);

userRouter.patch("/updateMe/:id", protect, updateMe);
userRouter.delete("/deleteMe/:id", protect, restrictTo("Admin"), deleteUser);

userRouter.get(
  "/closedAccounts",
  protect,
  restrictTo("admin"),
  getAllInactiveUsers
);

/*//////////////////////*/
/*BASIC CRUD ROUTE*/
/*//////////////////////*/
userRouter.route("/").get(protect, changedPasswordAfterToken, getAllUsers);

userRouter
  .route("/:id")
  .get(protect, getUserById)
  .patch(updateMe)
  .delete(deleteUser);

export default userRouter;
