import express from "express";
import { createTable, deleteTable, getTableById, getTables, updateTable } from "../controllers/table.controller.js";

const router = express.Router();


// router.post("/restaurants/:restaurantId/tables", createTable);
// router.get("/restaurants/:restaurantId/tables", getTables);
// router.get("/tables/:id", getTableById);
// router.put("/tables/:id", updateTable);
// router.delete("/tables/:id", deleteTable);

router.post("/createTable", createTable);
router.get("/getTables", getTables);
router.get("/tables/:id", getTableById);
router.put("/updateTables/:id", updateTable);
router.delete("/deleteTables/:id", deleteTable);


export default router;
