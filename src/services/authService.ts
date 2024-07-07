import { Auth } from 'aws-amplify';
import { AuthCredentials, UserData } from '../types';

export const login = async (credentials: AuthCredentials): Promise<UserData> => {
  const user = await Auth.signIn(credentials.email, credentials.password);
  return {
    id: user.attributes.sub,
    name: user.attributes.name,
    email: user.attributes.email,
  };
};

export const signup = async (userData: UserData): Promise<UserData> => {
  const { user } = await Auth.signUp({
    username: userData.email,
    password: userData.password,
    attributes: {
      email: userData.email,
      name: userData.name,
    },
  });
  return {
    id: user.getUsername(),
    name: userData.name,
    email: userData.email,
  };
};
