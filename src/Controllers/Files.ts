import { 
    S3Client , 
    PutObjectCommand, 
    ListObjectsV2Command , 
    DeleteObjectCommand, 
    CopyObjectCommand} 
from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  },
});

import { Response } from "express";


import { IUpdateFile } from "../Interfaces";


export const DeleteFile  =async (fileToUpdate: string) => {

          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_NAME_BUCKET,
            Key:fileToUpdate
          });

       return await s3.send(command);
}

export const updateFile = async (fileToUpdate: IUpdateFile) => {
        const copyParams = {
          Bucket: process.env.AWS_NAME_BUCKET,
          CopySource: `${process.env.AWS_NAME_BUCKET}/${fileToUpdate.oldKey}`,
          Key: fileToUpdate.newKey,
        };
        const isCopied = await s3.send(new CopyObjectCommand(copyParams));
}

export const uploadFile = async (req:any, res:Response)  => {
            const s3Params = {
              Bucket: process.env.AWS_NAME_BUCKET,
              Key:  `${req.email}/` +Date.now().toString() + '-' + req.file.originalname,
              Body: req.file.buffer,
              ContentType:req.filter.mimetype
            };
    
            const command = new PutObjectCommand(s3Params);
    
            await s3.send(command).then( response => {
              return res.status(200).json({
                message:"Archivo creado correctamente",
                status:200
              })
            }).catch( error => {
              console.log("Error al subir archivo ",error)
              return res.status(400).json({
                message:"Error al subir archivo"
              })
            })
}