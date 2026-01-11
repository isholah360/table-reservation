import prisma from "../prisma/client.js";

export const getWaitlistByRestaurantId = async (restaurantId) => {
  return await prisma.waitlist.findMany({
    where: { restaurantId },
    orderBy: { createdAt: "asc" },
  });
};