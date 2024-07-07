export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional password field for signup
}
