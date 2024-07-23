import { login, signup } from '../services/authService';
import { rootStore } from '../stores/rootStore';
import { signUp, confirmSignUp, type ConfirmSignUpInput, autoSignIn, signIn, type SignInInput, signOut, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  family_name: string;
  given_name: string;
  email: string;


}

export interface SignUpParameters {
  username: string;
  password: string;
  email: string;
  name: string;
  family_name: string;
  given_name: string
};

export const useAuthHandlers = () => {
  const { authStore } = rootStore;

  const handleSignUp = async ({
    username,
    password,
    name,
    email,
    family_name,
    given_name
  }: SignUpParameters, setError: any, setIsConfirmationRequired: any) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
            family_name,
            given_name
          },
          autoSignIn: true
        }
      });

      // Check if sign-up is complete or if an error message is returned
      if (nextStep) {
        setIsConfirmationRequired(true)
      }
    } catch (error: any) {
      console.log('error signing up:', error);
      setError(error.message || 'Error signing up');
      return null;
    }
  };

  const handleSignUpConfirmation = async ({
    username,
    confirmationCode
  }: ConfirmSignUpInput) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
      return { isSignUpComplete: isSignUpComplete, nextStep: nextStep }
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }

  const handleAutoSignIn = async () => {
    try {
      const signInOutput = await autoSignIn();
      console.log(signInOutput)
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = async ({ username, password }: SignInInput) => {
    let userData
    let sessionData
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (isSignedIn === true) {
        const attributes = await fetchUserAttributes()
        userData = {
          email: attributes.email,
          family_name: attributes.family_name,
          given_name: attributes.given_name,
          name: attributes.name,
          id: attributes.sub // Cognito User ID
        }
        const session = await fetchAuthSession();
        sessionData = session
        authStore.login(userData, sessionData)
        return true
      }
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  const handleCheckLogin = async (navigate: any, setCheckedUser: any) => {
    let userData
    let sessionData
    try {
      const attributes = await fetchUserAttributes()
      userData = {
        email: attributes.email,
        family_name: attributes.family_name,
        given_name: attributes.given_name,
        name: attributes.name,
        id: attributes.sub // Cognito User ID
      }
      const session = await fetchAuthSession();
      sessionData = session
      authStore.login(userData, sessionData)
      setCheckedUser(true)
      if (window.location.pathname === '/') {
        navigate('/dashboard')
      }
    } catch (error) {
      setCheckedUser(true)
      if (window.location.pathname === '/') {
        navigate('/landingpage')
      }
      console.log('error signing in', error);
    }
  };



  const handleLogout = async (navigate: any) => {
    try {
      await signOut();
      authStore.logout();
      navigate('/landingpage');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return { handleSignUp, handleSignUpConfirmation, handleAutoSignIn, handleLogin, handleLogout, handleCheckLogin }
}


