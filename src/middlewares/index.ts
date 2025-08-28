import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export async function access(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["api-key"] as string;

    if (!token) {
      return res.status(400).json({
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

      // Opcional: guardar los datos del usuario en la request
      req.body.user = decoded;

      console.log("Token válido:", decoded);
      next();
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Autentica a los usuarios mientras estan dentro del sitio
 */
export async function Authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Verificando existencia del token de autenticacion
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(400).json({
        status: 400,
        error: "Usuario no autenticado",
      });
    }

    const decodedToken = jwt.verify(token, process.env.codigo!);


    req.idUser = decodedToken.tokenUser.id;
    req.name = decodedToken.tokenUser.name;
    req.email = decodedToken.tokenUser.email;
    req.privilege = decodedToken.tokenUser.privilege;
    req.idCompany = decodedToken.tokenUser.company.id;

    next();
  } catch (error) {
    next(error);
  }
}
