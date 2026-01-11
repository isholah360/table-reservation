import express from "express";
import { cancelReservation, createReservation, updateReservation } from "../controllers/reservation.controller.js";
const reservationRouter = express.Router();

reservationRouter.post("/table", createReservation);
reservationRouter.put("/:id", updateReservation);
reservationRouter.delete("/:id", cancelReservation);

export default reservationRouter;
