import { Request, response, Response, Router } from "express";
//autenticacion de 2 factores
import { S3Client , PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"
import multer from 'multer';
import dotenv from 'dotenv';

import {access} from "../../middlewares/index";

dotenv.config();
// Configurar Multer para el almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

//Repositorios
const userRepository = AppDataSource.getRepository(User);
const filesRepository = AppDataSource.getRepository(UserFilePrivilege);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  },
});



// GET: obtener por correo
router.get("/file-privileges",access,async (req: Request, res: Response) => {

  const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_NAME_BUCKET,
      Prefix: `${req.email}/`,
  });

  try {
    const response = await s3.send(command);
  
      res.status(200).json({
        status:200,
        message:"Archivos encontrados",
        archivos:response.Contents
      })
    
  } catch (error) {
    res.status(500).json({
      message:"Error al consultar documentos"
    })
    
  }

});

// Ruta para subir el archivo a S3
router.post('/upload',access,upload.single('file'),async (req, res) => {

  const carpeta =`${req.email}/${req.file.originalname}`
  const url = "https://"+process.env.AWS_NAME_BUCKET+".s3."+process.env.AWS_REGION+".amazonaws.com/"+carpeta

  try {
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }
  
    const s3Params = {
      Bucket: process.env.AWS_NAME_BUCKET,
      Key:  `${req.email}` +Date.now().toString() + '-' + req.file.originalname, // Nombre único para el archivo
      Body: req.file.buffer, // El contenido binario del archivo
      ContentType:req.filter.mimetype
    };

    const command = new PutObjectCommand(s3Params);

    await s3.send(command).then( response => {
      return res.status(200)
    }).catch( error => {
      console.log("Error al subir archivo ",error)
      return res.status(400).json({
        message:"Error al subir archivo"
      })
    })
    
  } catch (error) {
    console.log("Error al procesar archivo ",error)
    res.status(500).json({
      message:"Error interno"
    })
  }

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
