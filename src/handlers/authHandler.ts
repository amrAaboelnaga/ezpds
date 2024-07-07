import { authStore } from '../stores/authStore';
import { login, signup } from '../services/authService';
import { AuthCredentials, UserData } from '../types';

export const handleLogin = async (credentials: AuthCredentials) => {
  try {
    const userData = await login(credentials);
    authStore.login(userData);
  } catch (error) {
    console.error("Login failed:", error);
    // Handle error (e.g., set error state in the store)
  }
};

export const handleSignup = async (userData: UserData) => {
  try {
    const newUser = await signup(userData);
    authStore.login(newUser);
  } catch (error) {
    console.error("Signup failed:", error);
    // Handle error (e.g., set error state in the store)
  }
};

export const handleLogout = async () => {
  try {
    await Auth.signOut();
    authStore.logout();
  } catch (error) {
    console.error("Logout failed:", error);
    // Handle error (e.g., set error state in the store)
  }
};
