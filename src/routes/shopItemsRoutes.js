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
  restrictTo("admin"),
  createShopItem
);

shopItemsRouter.get("/", protect, getAllShopItems);

shopItemsRouter.get("/:id", protect, getShopItembyId);

shopItemsRouter.patch(
  "/updateShopItem/:id",
  protect,
  restrictTo("admin"),
  updateShopItem
);

shopItemsRouter.delete(
  "/deleteShopItem/:id",
  protect,
  restrictTo("admin"),
  deleteShopItem
);

export default shopItemsRouter;
