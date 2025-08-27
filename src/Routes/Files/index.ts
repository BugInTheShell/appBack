import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
//autenticacion de 2 factores
import speakeasy from "speakeasy";

import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"
import multer from 'multer';

// Configurar Multer para el almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Ruta POST para subir el archivo a S3
router.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo.');
  }

  console.log("Archivo obtenido ",req.file)

  /* const s3Params = {
    Bucket: 'TU_NOMBRE_DE_BUCKET_S3', // Reemplaza con el nombre de tu bucket
    Key: Date.now().toString() + '-' + req.file.originalname, // Nombre único para el archivo
    Body: req.file.buffer, // El contenido binario del archivo
    ContentType: req.file.mimetype,
    ACL: 'public-read' // Opcional: para que el archivo sea públicamente accesible
  }; */

  // Subir el archivo a S3
  /* s3.upload(s3Params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
    if (err) {
      console.error('Error al subir a S3:', err);
      return res.status(500).send('Error al subir el archivo a S3.');
    }

    console.log("Archivo subido exitosamente a S3: ${data.Location}");

    }); */
    res.status(200).json({
      message: 'Archivo subido exitosamente a S3.',
      /* s3Location: data.Location,
      fileName: req.file.originalname, */
    });
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