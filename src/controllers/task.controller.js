
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Category from "../models/Category.js";

const validarTitulo = (titulo) =>
  typeof titulo === "string" &&
  titulo.trim().length >= 3 &&
  titulo.trim().length <= 100;

const validarDescripcion = (descripcion) =>
  typeof descripcion === "string" && descripcion.length <= 500;

const validarFecha = (fecha) =>
  typeof fecha === "string" &&
  !Number.isNaN(new Date(fecha).getTime());

const validarCategoria = async (categoria) => {
  if (categoria === undefined || categoria === null || categoria === "") {
    return { valida: true, valor: null };
  }

  if (!mongoose.isValidObjectId(categoria)) {
    return { valida: false, mensaje: "El ID de la categoría no es válido" };
  }

  const existe = await Category.findById(categoria);

  if (!existe) {
    return { valida: false, mensaje: "La categoría indicada no existe" };
  }

  return { valida: true, valor: categoria };
};

// GET /api/tasks
export const listarTareas = async (req, res) => {
  try {
    const tareas = await Task.find({ usuario: req.usuario.id })
      .populate("categoria", "nombre estado")
      .sort({ createdAt: -1 });

    return res.status(200).json(tareas);
  } catch (error) {
    console.error("Error al listar tareas:", error.message);
    return res.status(500).json({ mensaje: "Error al listar las tareas" });
  }
};

// GET /api/tasks/:id
export const obtenerTarea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: "El ID de la tarea no es válido" });
    }

    const tarea = await Task.findOne({
      _id: id,
      usuario: req.usuario.id,
    }).populate("categoria", "nombre estado");

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    return res.status(200).json(tarea);
  } catch (error) {
    console.error("Error al obtener tarea:", error.message);
    return res.status(500).json({ mensaje: "Error al obtener la tarea" });
  }
};

// POST /api/tasks
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    if (!validarTitulo(titulo)) {
      return res.status(400).json({
        mensaje: "El título es obligatorio y debe tener entre 3 y 100 caracteres",
      });
    }

    if (descripcion !== undefined && !validarDescripcion(descripcion)) {
      return res.status(400).json({
        mensaje: "La descripción debe ser un texto de hasta 500 caracteres",
      });
    }

    if (fechaEntrega !== undefined && !validarFecha(fechaEntrega)) {
      return res.status(400).json({ mensaje: "La fecha de entrega no es válida" });
    }

    if (completada !== undefined && typeof completada !== "boolean") {
      return res.status(400).json({ mensaje: "Completada debe ser un valor booleano" });
    }

    const resultadoCategoria = await validarCategoria(categoria);

    if (!resultadoCategoria.valida) {
      return res.status(400).json({ mensaje: resultadoCategoria.mensaje });
    }

    const tarea = await Task.create({
      titulo: titulo.trim(),
      ...(descripcion !== undefined && { descripcion: descripcion.trim() }),
      ...(fechaEntrega !== undefined && { fechaEntrega: new Date(fechaEntrega) }),
      completada: completada ?? false,
      categoria: resultadoCategoria.valor,
      usuario: req.usuario.id,
    });

    await tarea.populate("categoria", "nombre estado");

    return res.status(201).json(tarea);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ mensaje: "Los datos enviados no son válidos" });
    }

    console.error("Error al crear tarea:", error.message);
    return res.status(500).json({ mensaje: "Error al crear la tarea" });
  }
};

// PUT /api/tasks/:id
export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: "El ID de la tarea no es válido" });
    }

    const cambios = {};

    if (titulo !== undefined) {
      if (!validarTitulo(titulo)) {
        return res.status(400).json({
          mensaje: "El título debe tener entre 3 y 100 caracteres",
        });
      }
      cambios.titulo = titulo.trim();
    }

    if (descripcion !== undefined) {
      if (!validarDescripcion(descripcion)) {
        return res.status(400).json({
          mensaje: "La descripción debe ser un texto de hasta 500 caracteres",
        });
      }
      cambios.descripcion = descripcion.trim();
    }

    if (fechaEntrega !== undefined) {
      if (!validarFecha(fechaEntrega)) {
        return res.status(400).json({ mensaje: "La fecha de entrega no es válida" });
      }
      cambios.fechaEntrega = new Date(fechaEntrega);
    }

    if (completada !== undefined) {
      if (typeof completada !== "boolean") {
        return res.status(400).json({
          mensaje: "Completada debe ser un valor booleano",
        });
      }
      cambios.completada = completada;
    }

    if (categoria !== undefined) {
      const resultadoCategoria = await validarCategoria(categoria);

      if (!resultadoCategoria.valida) {
        return res.status(400).json({ mensaje: resultadoCategoria.mensaje });
      }

      cambios.categoria = resultadoCategoria.valor;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({
        mensaje: "Debés enviar al menos un campo para actualizar",
      });
    }

    const tarea = await Task.findOneAndUpdate(
      { _id: id, usuario: req.usuario.id },
      cambios,
      { new: true, runValidators: true }
    ).populate("categoria", "nombre estado");

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    return res.status(200).json(tarea);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ mensaje: "Los datos enviados no son válidos" });
    }

    console.error("Error al actualizar tarea:", error.message);
    return res.status(500).json({ mensaje: "Error al actualizar la tarea" });
  }
};

// DELETE /api/tasks/:id
export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: "El ID de la tarea no es válido" });
    }

    const tarea = await Task.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id,
    });

    if (!tarea) {
      return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    return res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error.message);
    return res.status(500).json({ mensaje: "Error al eliminar la tarea" });
  }
};
