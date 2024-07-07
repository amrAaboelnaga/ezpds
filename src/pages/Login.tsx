import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { handleLogin } from '../handlers/authHandler';

const Login: React.FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await handleLogin({ email, password });
      // Redirect or update UI on successful login
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
});

export default Login;
