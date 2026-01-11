-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);
