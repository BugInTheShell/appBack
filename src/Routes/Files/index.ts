import { Request, response, Response, Router } from "express";
//autenticacion de 2 factores
import { S3Client , PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"
import multer from 'multer';
import dotenv from 'dotenv';
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

// GET: listar todos
router.get("/file-privileges", async (req: Request, res: Response) => {
  const privileges = await filesRepository.find();
  res.json(privileges);
});

// GET: obtener por correo
router.get("/file-privileges/", async (req: Request, res: Response) => {

  /* const privilege = await filesRepository.findOneBy({
    email:req.email,
  });
  res.json(privilege); */

  const command = new ListObjectsV2Command({
      Bucket: "almacenamiento-examen",
      Prefix: "Inicio/",
  });

  const response = await s3.send(command);

    if (!response.Contents) {
      console.log("📂 Carpeta vacía o no existe");
      return [];
    }

    const archivos = response.Contents.map((obj) => obj.Key);
    console.log("Archivos encontrados:", archivos);
    res.status(200).json({
      status:200,
      message:"Archivos encontrados",
      archivos
    })



});

// Ruta POST para subir el archivo a S3
router.post('/upload', upload.single('file'),async (req, res) => {

  const token = req;
  console.log("Token de inicio de sesión ",token)

  const bucket = "almacenamiento-examen";
  const carpeta =`Imagenes/${req.file.originalname}`
  const url = "https://"+bucket+".s3."+process.env.AWS_REGION+".amazonaws.com/"+carpeta

  console.log("Carpeta a subir ",url)

  try {
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }
  
    console.log("Archivo obtenido ",req.file)
  
    const s3Params = {
      Bucket: bucket,
      Key:  "Imagenes/" +Date.now().toString() + '-' + req.file.originalname, // Nombre único para el archivo
      Body: req.file.buffer, // El contenido binario del archivo
      ContentType:req.filter.mimetype
    };

    const command = new PutObjectCommand(s3Params);
    await s3.send(command).then( response => {
      return res.status(200).json({
        status: 200,
        url
      })
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