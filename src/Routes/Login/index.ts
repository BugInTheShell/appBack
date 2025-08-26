import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../models";
import { AppDataSource } from "../../../database/typeorm.js";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Clave secreta para JWT (ponla en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔹 Ruta de prueba
router.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    response: "Ruta login :D",
  });
});

// 🔹 LOGIN
router.post("/", async (req: Request, res: Response) => {
  console.log("Si funciona la ruta ");
  const { email, password } = req.body;
	console.log("Datos ",req.body)
  try {
    // Buscar usuario por nombre
    const user = await userRepository.findOne({where:{ email },select: ["id", "name", "email", "password"],});
    console.log("Usuario ",user);	

    if (!user) {
      return res.status(500).json({ error: "Usuario no encontrado" });
    }

    // ⚠️ Aquí deberías usar bcrypt.compare en lugar de comparar plano
    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign(
      { id: user.id, name: user.name }, // payload
      JWT_SECRET,
      { expiresIn: "1h" } // expira en 1 hora
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔹 LOGOUT (simple, invalida el token en frontend)
router.post("/logout", async (req: Request, res: Response) => {
  // En sistemas con JWT puro, el "logout" se maneja en frontend eliminando el token
  // o manteniendo una blacklist en backend.
  res.status(200).json({
  message: "Sesión cerrada exitosamente",
  });
});

export default router;

