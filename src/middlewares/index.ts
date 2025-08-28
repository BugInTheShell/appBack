import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export async function access(req, res: Response, next: NextFunction) {
  try {
    console.log("Request ",req)
    const token = req.headers["api-key"] as string;

    if (!token) {
       res.status(400).json({
        status: 400,
        error: "Sin token proporcionado",
      });
    }

    // Verifica el token
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        console.error("Error al verificar token:", err);
        return res.status(403).json({
          status: 403,
          error: "Acceso Denegado - Token inválido o expirado",
        });
      }
      console.log("Objeto decodificado ",decoded)
      req.idUser = decoded.id
      req.nameUser = decoded.name;
      req.privilege = decoded.privilege;
      req.email =decoded.email;

      next();
    });
  } catch (error) {
    next(error);
  }
}
