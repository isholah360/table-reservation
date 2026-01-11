import prisma from "../prisma/client.js";
import {
  calculateEndTime,
  isWithinOperatingHours,
} from "../utils/time.utils.js";
import { isTableAvailable } from "../services/availability.service.js";
import { isPeakHour } from "../utils/peak.utils.js";

// CREATE RESERVATION
export const createReservation = async (req, res, next) => {
  try {
    const {
      restaurantId,
      tableId,
      customerName,
      phone,
      partySize,
      startTime,
      duration,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const start = new Date(startTime);
    const end = calculateEndTime(start, duration);

    if (isPeakHour(start) && duration > 90) {
      return res.status(400).json({
        message:
          "Maximum reservation duration is 90 minutes during peak hours (6 PM – 9 PM).",
      });
    }

    if (
      !isWithinOperatingHours(
        start,
        end,
        restaurant.opensAt,
        restaurant.closesAt
      )
    ) {
      return res.status(400).json({ message: "Outside operating hours" });
    }

    const table = await prisma.table.findUnique({ where: { id: tableId } });

    if (partySize > table.capacity) {
      return res.status(400).json({ message: "Table capacity exceeded" });
    }

    const available = await isTableAvailable(tableId, start, end);

    if (!available) {
      
      const waitlistEntry = await prisma.waitlist.create({
        data: {
          restaurantId,
          customerName,
          phone,
          partySize,
        },
      });

      return res.status(202).json({
        message: "Table is booked already. You're added to the waitlist.",
        waitlistId: waitlistEntry.id,
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        phone,
        partySize,
        startTime: start,
        endTime: end,
        restaurantId,
        tableId,
      },
    });

    console.log(
      `Dear ${customerName}, Reservation confirmed for ${startTime} and ${end}`
    );
    console.log(`Reservation details: ${JSON.stringify(reservation)}`);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

// UPDATE RESERVATION
export const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startTime, duration, tableId } = req.body;

    const existing = await prisma.reservation.findUnique({ where: { id } });
    if (!existing)
      return res.status(404).json({ message: "Reservation not found" });

    const start = new Date(startTime);
    const end = calculateEndTime(start, duration);

    const available = await isTableAvailable(tableId, start, end, id);

    if (!available) {
      return res.status(409).json({ message: "Table already booked" });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        startTime: start,
        endTime: end,
        tableId,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// CANCEL RESERVATION
export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    res.json({ message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
};
