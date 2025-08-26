import { ICreateUser, IValidateUser} from "../Interfaces"
import bcrypt from "bcryptjs";
import { AppDataSource} from "../../database/typeorm";
import { User } from "../models";
import { User_Privileges } from "../enums/privileges";
import jwt from "jsonwebtoken";
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
