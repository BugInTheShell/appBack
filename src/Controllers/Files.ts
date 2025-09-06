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