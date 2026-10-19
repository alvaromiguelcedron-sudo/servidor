
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      username.trim().length < 3 ||
      username.trim().length > 30
    ) {
      return res.status(400).json({
        mensaje: "El nombre debe tener entre 3 y 30 caracteres",
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        mensaje: "El correo electrónico no es válido",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await User.findOne({
      email: emailNormalizado,
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      username: username.trim(),
      email: emailNormalizado,
      password: passwordHash,
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Los datos enviados no son válidos",
      });
    }

    console.error("Error al registrar usuario:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al registrar el usuario",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        mensaje: "Debés ingresar un correo válido y una contraseña",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET");
      return res.status(500).json({
        mensaje: "Error de configuración del servidor",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuario = await User.findOne({
      email: emailNormalizado,
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión correcto",
      token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión",
    });
  }
});

export default router;
