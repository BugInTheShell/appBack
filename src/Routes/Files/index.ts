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

// GET: listar todos
router.get("/file-privileges", async (req: Request, res: Response) => {
  const privileges = await filesRepository.find();
  res.json(privileges);
});

// GET: obtener por id
router.get("/file-privileges/:id", async (req: Request, res: Response) => {
  const privilege = await filesRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  res.json(privilege);
});

// POST: crear
router.post("/file-privileges", async (req: Request, res: Response) => {
  const newPrivilege = filesRepository.create(req.body);
  const result = await filesRepository.save(newPrivilege);
  res.json(result);
});

// PUT: actualizar
router.put("/file-privileges/:id", async (req: Request, res: Response) => {
  await filesRepository.update(req.params.id, req.body);
  res.json({ message: "Privilegio actualizado" });
});

// DELETE: eliminar
router.delete("/file-privileges/:id", async (req: Request, res: Response) => {
  await filesRepository.delete(req.params.id);
  res.json({ message: "Privilegio eliminado" });
});


router.get("/",async (req , res) => {
    res.status(200).json({
        response: "Ruta login :D"
    })
})



export default router;