
import "dotenv/config";
import express from "express";

import conectarDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.status(200).send("API REST de tareas y categorías funcionando correctamente");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de categorías
app.use("/api/categories", categoryRoutes);

// Rutas de tareas
app.use("/api/tasks", taskRoutes);

// Iniciar servidor después de conectar MongoDB
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
