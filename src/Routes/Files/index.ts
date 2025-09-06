import { Request, response, Response, Router } from "express";
//autenticacion de 2 factores
import { S3Client , PutObjectCommand, ListObjectsV2Command , DeleteObjectCommand, CopyObjectCommand} from "@aws-sdk/client-s3";

import { File_Privileges, User_Privileges } from "../../enums/privileges";
import { User } from "../../models";
import { UserFilePrivilege } from "../../models";
import {AppDataSource} from "../../../database/typeorm.js"
import multer from 'multer';
import dotenv from 'dotenv';
import { IUpdateFile } from "../../Interfaces";
import {access} from "../../middlewares/index";

import { DeleteFile , uploadFile } from "../../Controllers/Files";

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



// GET: Obtener archivos por medio de jwt
router.get("/file-privileges",access,async (req:any, res: Response) => {

  const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_NAME_BUCKET,
      //Aqui cree la ruta con el email previamente validado en el middleware access
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
    console.log("Error ",error)
    res.status(500).json({
      message:"Error al consultar documentos"
    })
    
  }
});

// Ruta para subir el archivo a S3
router.post('/upload',upload.single('file'),access,async (req:any, res) => {
      try {
        if (!req.file) {
          return res.status(400).send('No se ha subido ningún archivo.');
        }
      
        await uploadFile(req,res)
        
      } catch (error) {
        console.log("Error al procesar archivo ",error)
        res.status(500).json({
          message:"Error interno"
        })
      }

});

// PUT: actualizar
router.put("/",access,async (req: Request, res: Response) => {

  const objetcToUpdate : IUpdateFile = req.body;

  try {

     const isDeleted = await DeleteFile(objetcToUpdate.oldKey);

       if(isDeleted) {

       }

  } catch (err) {
    console.error("Error al renombrar archivo:", err);
    return { success: false, error: err };
  }
});

// DELETE: eliminar
router.delete("/",access,async (req: Request, res: Response) => {
    try {
      const {key} = req.body;
      
      if(!key){
        return res.status(400).json({
          status:400,
          message:"No se encontró key"
        })
      }


      if(!key.split("/")[1]){
        return res.status(400).json({
          status:400,
          message:"No se puede eliminar el archivo root"
        })
      }

    const isDeleted = await DeleteFile(key);

    if (isDeleted){
      res.status(200).json({ 
        status:200,
        message: `Archivo ${key} eliminado con éxito` 
      });

    }

      
    } catch (error) {
      console.log("Error al borrar archivo ",error)
      res.status(500).json({
        status:500,
        message:"Error al eliminar archivo"
      })
      
    }
});





export default router;
