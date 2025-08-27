import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export async function access(req: Request, res: Response, next: NextFunction) {
  try {
     if (req.headers["api-key"]) {
      
      const verify = await jwt.verify(
        req.headers["api-key"] as string,
        process.env.JWT_SECRET!,
        (err, decoded) => {
          if (err) {
            console.log(err);
            throw {
              status: 403,
              statusText: "Acceso Denegado",
            };
          } else {
            next();
          }
        }
      );
      console.log("Verificacion ",verify)
    } else {
      return res.status(400).json({
        status: 400,
        error: "Sin token proporcionado",
      });
    }
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
