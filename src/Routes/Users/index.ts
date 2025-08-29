import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
//autenticacion de 2 factores
import speakeasy from "speakeasy";
import { createUser, createUserLoged } from "../../Controllers/Login";
import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"
import { access } from "../../middlewares";
const router = Router();

//Repositorios
const userRepository = AppDataSource.getRepository(User);

// GET: listar todos los usuarios
router.get("/",access ,async (req, res: Response) => {
  const users = await userRepository.findAll({
  where: {
    registeredBy: req.email
  }
});

  res.json(users);
});

// GET: obtener un usuario por id
router.get("/:id",access ,async (req: Request, res: Response) => {
  const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
  res.json(user);
});

// POST: crear un usuario sin log
router.post("/create" ,async (req:Request, res: Response) => {
   try {
    console.log("Data obtendia ",req.body)
    const createuser = await createUser(req.body);

    if(createuser){
      res.status(200).json({
        status:200,
        message:"Usuario creado correctamente"
      });
    }

   } catch (error) {
   	console.log("Error al enviar datos ",error);
    res.status(500).json({
      status:500,
      message:error
    })
   
   }
});


// POST: crear un usuario con log
router.post("/",access ,async (req:Request, res: Response) => {
   try {
    console.log("Data obtendia ",req.body)

    const createuser = await createUserLoged(req.body, req);

    if(createuser){
      res.status(200).json({
        status:200,
        message:"Usuario creado correctamente"
      });
    }

   } catch (error) {
   	console.log("Error al enviar datos ",error);
    res.status(500).json({
      status:500,
      message:error
    })
   
   }
});

// PUT: actualizar un usuario
router.put("/users/:id", access,async (req: Request, res: Response) => {
  await userRepository.update(req.params.id, req.body);
  res.json({ message: "Usuario actualizado" });
});

// DELETE: eliminar un usuario
router.delete("/:id", access,async (req: Request, res: Response) => {
  console.log("Data de usuario a eliminar ",req.params.id)
  try {
    await userRepository.delete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado", status:200 });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", status:500 })
  }
});



export default router;
