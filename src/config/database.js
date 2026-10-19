
import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("La variable MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
    throw error;
  }
};

export default conectarDB;
