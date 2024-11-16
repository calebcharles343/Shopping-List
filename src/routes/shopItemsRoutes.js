import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createShopItem,
  deleteShopItem,
  getAllShopItems,
  getShopItembyId,
  updateShopItem,
} from "../controllers/shopItemsController.js";

const shopItemsRouter = express.Router();

shopItemsRouter.post(
  "/addShopItem",
  protect,
  restrictTo("Admin"),
  createShopItem
);

shopItemsRouter.get("/", protect, getAllShopItems);

shopItemsRouter.get("/:id", protect, getShopItembyId);

shopItemsRouter.patch(
  "/updateShopItem/:id",
  protect,
  restrictTo("Admin"),
  updateShopItem
);

shopItemsRouter.delete(
  "/deleteShopItem/:id",
  protect,
  restrictTo("Admin"),
  deleteShopItem
);

export default shopItemsRouter;
