
import "dotenv/config";
import express from "express";
import conectarDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor de autenticación funcionando correctamente");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

const iniciarServidor = async () => {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
};

iniciarServidor();
