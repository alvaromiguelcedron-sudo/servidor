
import mongoose from "mongoose";
import Category from "../models/Category.js";

// Validar nombre de categoría
const validarNombre = (nombre) => {
  return (
    typeof nombre === "string" &&
    nombre.trim().length >= 3 &&
    nombre.trim().length <= 50
  );
};

// GET /api/categories
// Listar todas las categorías
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Category.find().sort({ nombre: 1 });

    return res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al listar categorías:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al listar las categorías",
    });
  }
};

// GET /api/categories/:id
// Obtener una categoría por ID
export const obtenerCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El ID de la categoría no es válido",
      });
    }

    const categoria = await Category.findById(id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al obtener la categoría",
    });
  }
};

// POST /api/categories
// Crear una categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    if (!validarNombre(nombre)) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio y debe tener entre 3 y 50 caracteres",
      });
    }

    if (estado !== undefined && typeof estado !== "boolean") {
      return res.status(400).json({
        mensaje: "El estado debe ser un valor booleano",
      });
    }

    const nombreNormalizado = nombre.trim();

    // Buscar duplicados ignorando mayúsculas y minúsculas
    const existente = await Category.findOne({
      nombre: {
        $regex: `^${nombreNormalizado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existente) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    const categoria = await Category.create({
      nombre: nombreNormalizado,
      ...(estado !== undefined && { estado }),
    });

    return res.status(201).json({
      mensaje: "Categoría creada correctamente",
      categoria,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        mensaje: "Los datos enviados no son válidos",
      });
    }

    console.error("Error al crear categoría:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al crear la categoría",
    });
  }
};

// PUT /api/categories/:id
// Actualizar una categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El ID de la categoría no es válido",
      });
    }

    if (nombre !== undefined && !validarNombre(nombre)) {
      return res.status(400).json({
        mensaje: "El nombre debe tener entre 3 y 50 caracteres",
      });
    }

    if (estado !== undefined && typeof estado !== "boolean") {
      return res.status(400).json({
        mensaje: "El estado debe ser un valor booleano",
      });
    }

    const cambios = {};

    if (nombre !== undefined) {
      const nombreNormalizado = nombre.trim();

      const duplicada = await Category.findOne({
        nombre: {
          $regex: `^${nombreNormalizado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        },
        _id: { $ne: id },
      });

      if (duplicada) {
        return res.status(409).json({
          mensaje: "Ya existe una categoría con ese nombre",
        });
      }

      cambios.nombre = nombreNormalizado;
    }

    if (estado !== undefined) {
      cambios.estado = estado;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({
        mensaje: "Debés enviar al menos un campo para actualizar",
      });
    }

    const categoria = await Category.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    });

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Categoría actualizada correctamente",
      categoria,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        mensaje: "Los datos enviados no son válidos",
      });
    }

    console.error("Error al actualizar categoría:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al actualizar la categoría",
    });
  }
};

// DELETE /api/categories/:id
// Eliminar una categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El ID de la categoría no es válido",
      });
    }

    const categoria = await Category.findByIdAndDelete(id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al eliminar la categoría",
    });
  }
};
