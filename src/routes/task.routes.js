
import express from "express";
import auth from "../middlewares/auth.js";

import {
  listarTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", auth, listarTareas);
router.get("/:id", auth, obtenerTarea);
router.post("/", auth, crearTarea);
router.put("/:id", auth, actualizarTarea);
router.delete("/:id", auth, eliminarTarea);

export default router;
