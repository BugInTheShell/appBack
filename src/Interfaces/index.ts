export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  Phone_number?: string; // opcional por si no lo envían
}
