
import { getWaitlistByRestaurantId } from "../services/waitlist.service.js";

export const getRestaurantWaitlist = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const waitlist = await getWaitlistByRestaurantId(restaurantId);
    res.json(waitlist);
  } catch (err) {
    next(err);
  }
};