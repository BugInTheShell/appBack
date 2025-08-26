import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../models";
import { AppDataSource } from "../../../database/typeorm.js";
import { login } from "../../Controllers/Login";
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
  
  const { email, password } = req.body;
	console.log("Datos ",req.body)
  try {
    const isLogged = await login( req.body);

    if(isLogged){
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        isLogged,
      });
    }
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

