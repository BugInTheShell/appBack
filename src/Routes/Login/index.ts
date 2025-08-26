import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models";
import { AppDataSource } from "../../../database/typeorm.js";
import { login } from "../../Controllers/Login";
const router = Router();
const userRepository = AppDataSource.getRepository(User);

// 🔹 LOGIN
router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Datos ", req.body);

  try {
    const isLogged = await login(req.body);

    if (isLogged) {
      // Suponiendo que login devuelve el token JWT
      const jwtToken = isLogged.token; // ajusta según tu implementación

      // Establecer la cookie por 12 horas
      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: true,      // solo HTTPS
        sameSite: 'strict', 
        maxAge: 12 * 60 * 60 * 1000 // 12 horas
      });

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        isLogged,
        status:200
      });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
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

