import prisma from "../prisma/client.js";

// CREATE TABLE
export const createTable = async (req, res, next) => {
  try {
    // const { restaurantId } = req.params;
    const { number, capacity, restaurantId } = req.body;

    if (capacity <= 0) {
      return res.status(400).json({ message: "Capacity must be greater than zero" });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const table = await prisma.table.create({
      data: {
        number,
        capacity,
        restaurantId
      }
    });

    res.status(201).json(table);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Table number already exists" });
    }
    next(err);
  }
};

// GET ALL TABLES FOR A RESTAURANT
export const getTables = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const tables = await prisma.table.findMany({
      where: { restaurantId }
    });

    res.json(tables);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE TABLE
export const getTableById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({ where: { id } });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (err) {
    next(err);
  }
};

// UPDATE TABLE
export const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: "CONFIRMED",
            endTime: { gt: new Date() }
          }
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (capacity && capacity < table.capacity) {
      const maxParty = Math.max(
        0,
        ...table.reservations.map(r => r.partySize)
      );

      if (capacity < maxParty) {
        return res.status(400).json({
          message: "Cannot reduce capacity below existing reservation party size"
        });
      }
    }

    const updated = await prisma.table.update({
      where: { id },
      data: {
        tableNumber,
        capacity
      }
    });

    res.json(updated);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Table number already exists" });
    }
    next(err);
  }
};

// DELETE TABLE
export const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const activeReservation = await prisma.reservation.findFirst({
      where: {
        tableId: id,
        status: "CONFIRMED",
        endTime: { gt: new Date() }
      }
    });

    if (activeReservation) {
      return res.status(400).json({
        message: "Cannot delete table with active reservations"
      });
    }

    await prisma.table.delete({ where: { id } });

    res.json({ message: "Table deleted successfully" });
  } catch (err) {
    next(err);
  }
};
