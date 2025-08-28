import { ICreateUser, IValidateUser} from "../Interfaces"
import AWS from 'aws-sdk';
import bcrypt from "bcryptjs";
import { AppDataSource} from "../../database/typeorm";
import { User } from "../models";
import { User_Privileges } from "../enums/privileges";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const userRepository = AppDataSource.getRepository(User);

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const createUser = async ( user : ICreateUser) => {
  try {
    // 1. Hashear la contraseña del usuario
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 2. Crear una nueva instancia de usuario en el repositorio
    const newUser = userRepository.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      phoneNumber: user.phoneNumber,
      privilege: User_Privileges.Mango,
    });

    // 3. Guardar el nuevo usuario en la base de datos
    const savedUser = await userRepository.save(newUser);

    // 4. Definir los parámetros para crear la carpeta en S3
    const folderName = `${user.email}/`; // La clave debe terminar en '/' para ser una carpeta
    const folderParams = {
      Bucket: "almacenamiento-examen", // Asegúrate de tener esta variable de entorno
      Key: folderName,
      Body: '', // Un cuerpo vacío es suficiente para crear la carpeta
    };

    // 5. Crear la carpeta en S3
    await s3.upload(folderParams).promise();
    console.log(`Carpeta creada con éxito en S3 para el usuario: ${user.email}`);

    // 6. Retornar el usuario guardado
    return savedUser;

  } catch (error) {
    console.error("Error al crear el usuario o la carpeta en S3:", error);
    // Puedes lanzar el error o retornar un valor específico para manejarlo en la llamada
    throw error;
  }
};

export const login = async ( user: IValidateUser) => {
	console.log("Usuario en funcion ",user)
  
    const userLoged = await userRepository.findOne({
    where: { email:user.email },
    select :["id", "name", "email", "password", "privilege"]
  } );
	console.log("Usuario encontrado en funcion ",userLoged)
   if (!userLoged) {
        return false;
    }

    const isMatch = await bcrypt.compare(user.password, userLoged.password);
    console.log("es mach ",isMatch)
    if (!isMatch) {
        return false;
    }

    const token = jwt.sign(
    {
      id: userLoged.id,
      name: userLoged.name,
      email: userLoged.email,
      privilege: userLoged.privilege,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }

  );

  return token;

}
