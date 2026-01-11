import prisma from "../prisma/client.js";

export const isTableAvailable = async (tableId, startTime, endTime, excludeReservationId) => {
  const where = {
    tableId,
    status: "CONFIRMED",
    startTime: { lt: endTime },
    endTime: { gt: startTime }
  };

  if (excludeReservationId) {
    where.id = { not: excludeReservationId };
  }

  const conflict = await prisma.reservation.findFirst({ where });
  return !conflict;
}


