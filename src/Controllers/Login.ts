import { ICreateUser} from "../Interfaces"
import bcrypt from "bcryptjs";
import { AppDataSource} from "../../database/typeorm";
import { User } from "../models";
import { User_Privileges } from "../enums/privileges";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async ( user : ICreateUser) => {

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = userRepository.create({
    name: user.name,
    email: user.email,
    password: hashedPassword,
    phoneNumber: user.Phone_number,
    privilege: User_Privileges.Mango,
  });

  return await userRepository.save(newUser);

};