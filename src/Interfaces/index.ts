export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  registeredby?: string 
}

export interface IValidateUser {
  email:string,
  password:string
}

export interface IUpdateFile {
  oldKey:string,
  newKey:string
}
