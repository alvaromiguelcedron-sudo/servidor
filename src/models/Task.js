
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"],
      maxlength: [100, "El título no puede superar los 100 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede superar los 500 caracteres"],
    },
    fechaEntrega: {
      type: Date,
    },
    completada: {
      type: Boolean,
      default: false,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
