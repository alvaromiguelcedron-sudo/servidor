
import express from "express";
import auth from "../middlewares/auth.js";

import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", auth, listarCategorias);
router.get("/:id", auth, obtenerCategoria);
router.post("/", auth, crearCategoria);
router.put("/:id", auth, actualizarCategoria);
router.delete("/:id", auth, eliminarCategoria);

export default router;
