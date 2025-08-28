export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string; 
}

export interface IValidateUser {
  email:string,
  password:string
}
