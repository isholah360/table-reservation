import express from "express";
import { cancelReservation, createReservation, updateReservation } from "../controllers/reservation.controller.js";
const reservationRouter = express.Router();

reservationRouter.post("/createReservation", createReservation);
reservationRouter.put("/updateReservation/:id", updateReservation);
reservationRouter.delete("/deleteReservation/:id", cancelReservation);



export default reservationRouter;
