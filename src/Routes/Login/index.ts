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

/*
*
POST http://https://191.101.1.4:8443/login/
*
*/


router.get("/",async (req , res) => {
    res.status(200).json({
        response: "Ruta login :D"
    })
})



export default router;