// Signup.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ConfirmationForm from '../components/signup-components/ConfirmationForm';
import SignupForm from '../components/signup-components/SignupForm';


const Signup: React.FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {isConfirmationRequired ? (
        <ConfirmationForm
          setIsConfirmationRequired={setIsConfirmationRequired}
          setError={setError}
          setLoading={setLoading}
          email={email}
          password={password}
        />
      ) : (
        <SignupForm
          setIsConfirmationRequired={setIsConfirmationRequired}
          setError={setError}
          setLoading={setLoading}
          setEmail={setEmail}
          setPassword={setPassword}
          setGivenName={setGivenName}
          setFamilyName={setFamilyName}
          email={email}
          password={password}
          givenName={givenName}
          familyName={familyName}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
});

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
};

export default Signup;
