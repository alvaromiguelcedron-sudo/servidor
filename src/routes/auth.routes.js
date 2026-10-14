import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      username,
      email,
      password: passwordHash,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar el usuario",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });

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
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      mensaje: "Inicio de sesión correcto",
      token,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
    });
  }
});

export default router;