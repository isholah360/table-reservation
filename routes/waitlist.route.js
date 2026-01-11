import { Router } from "express";
import { getRestaurantWaitlist } from "../controllers/waitlist.Controller.js";

const waitlistRouter = Router();

waitlistRouter.get("/restaurants/:restaurantId", getRestaurantWaitlist);

export default waitlistRouter;