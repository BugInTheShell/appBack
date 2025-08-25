import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
//autenticacion de 2 factores
import speakeasy from "speakeasy";

import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"

const router = Router();

//Repositorios
const userRepository = AppDataSource.getRepository(User);
const filesRepository = AppDataSource.getRepository(UserFilePrivilege);


// GET: listar todos los usuarios
router.get("/", async (req: Request, res: Response) => {
  const users = await userRepository.find();
  res.json(users);
});

// GET: obtener un usuario por id
router.get("/:id", async (req: Request, res: Response) => {
  const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
  res.json(user);
});

// POST: crear un usuario
router.post("/", async (req: Request, res: Response) => {
  console.log("Data obtendia ",req)
  //const newUser = userRepository.create(req.body);
  //const result = await userRepository.save(newUser);
  res.status(200).json("Peticion hecha correctamente");
});

// PUT: actualizar un usuario
router.put("/users/:id", async (req: Request, res: Response) => {
  await userRepository.update(req.params.id, req.body);
  res.json({ message: "Usuario actualizado" });
});

// DELETE: eliminar un usuario
router.delete("/users/:id", async (req: Request, res: Response) => {
  await userRepository.delete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});



export default router;