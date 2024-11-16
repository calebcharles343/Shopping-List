import {
  createShopItemService,
  deleteShopItemService,
  getAllShopItemsService,
  getShopItemByIdService,
  updateShopItemService,
} from "../models/ShopItemsModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const createShopItem = catchAsync(async (req, res, next) => {
  const newshopItem = await createShopItemService(
    req.body.item_name,
    req.body.price
  );

  handleResponse(res, 201, "Item created successfully", newshopItem);
});

export const getAllShopItems = catchAsync(async (req, res, next) => {
  const shopItems = await getAllShopItemsService();
  handleResponse(res, 200, "Items fetched successfully", shopItems);
});

export const getShopItembyId = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const shopItem = await getShopItemByIdService(id);

  if (!shopItem) return handleResponse(res, 404, "Item not found");
  handleResponse(res, 200, "Item fetched successfully", shopItem);
});

export const updateShopItem = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "item_name", "price");

  console.log("Filtered body:", filteredBody);

  // 3) Update user record
  const updatedShopItem = await updateShopItemService(
    req.user.id,
    filteredBody.item_name,
    filteredBody.price
  );

  console.log("Updated user:", updatedShopItem);

  if (!updatedShopItem) {
    return next(new AppError("No Shop Item found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      shop_item: updatedShopItem,
    },
  });
});

export const deleteShopItem = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const deletedShopItem = await deleteShopItemService(id);

  if (!deletedShopItem) return handleResponse(res, 404, "Shop item not found");
  handleResponse(res, 200, "Shop item deleted successfully", deletedShopItem);
});
