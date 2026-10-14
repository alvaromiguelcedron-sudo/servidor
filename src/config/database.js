import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/auth_web24");
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
  }
};

export default conectarDB;