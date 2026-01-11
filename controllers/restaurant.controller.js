import prisma from "../prisma/client.js";


export const createRestaurant = async (req, res, next) => {
  try {
    const { name, opensAt, closesAt } = req.body;

    if (
      opensAt < 0 ||
      opensAt > 23 ||
      closesAt < 0 ||
      closesAt > 23
    ) {
      return res.status(400).json({ message: "Invalid opening or closing hour" });
    }

    if (opensAt >= closesAt) {
      return res.status(400).json({
        message: "Opening hour must be before closing hour"
      });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        opensAt,
        closesAt
      }
    });

    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
};

// GET ALL RESTAURANTS
export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE RESTAURANT (WITH TABLES)
export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: {
        tables: true
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

// UPDATE RESTAURANT
export const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, opensAt, closesAt } = req.body;

    if (
      opensAt !== undefined &&
      (opensAt < 0 || opensAt > 23)
    ) {
      return res.status(400).json({ message: "Invalid opening hour" });
    }

    if (
      closesAt !== undefined &&
      (closesAt < 0 || closesAt > 23)
    ) {
      return res.status(400).json({ message: "Invalid closing hour" });
    }

    if (
      opensAt !== undefined &&
      closesAt !== undefined &&
      opensAt >= closesAt
    ) {
      return res.status(400).json({
        message: "Opening hour must be before closing hour"
      });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: Number(id) },
      data: {
        name,
        opensAt,
        closesAt
      }
    });

    res.json(restaurant);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    next(err);
  }
};

// DELETE RESTAURANT
export const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurantId = Number(id);

    const hasTables = await prisma.table.findFirst({
      where: { restaurantId }
    });

    if (hasTables) {
      return res.status(400).json({
        message: "Cannot delete restaurant with existing tables"
      });
    }

    const hasReservations = await prisma.reservation.findFirst({
      where: { restaurantId }
    });

    if (hasReservations) {
      return res.status(400).json({
        message: "Cannot delete restaurant with existing reservations"
      });
    }

    await prisma.restaurant.delete({
      where: { id: restaurantId }
    });

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    next(err);
  }
};
