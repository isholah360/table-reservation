import express from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurant.controller.js";
const restRouter = express.Router();

restRouter.post("/create", createRestaurant);
restRouter.get("/getRestaurants", getRestaurants);
restRouter.get("/getRestaurants/:id", getRestaurantById);
restRouter.put("/updateRestaurants/:id", updateRestaurant);
restRouter.delete("/deleteRestaurants/:id", deleteRestaurant);

export default restRouter;
