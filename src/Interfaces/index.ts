export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  Phone_number?: string; 
}

export interface IValidateUser {
  email:string,
  password:string
}
