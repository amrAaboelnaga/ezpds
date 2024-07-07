import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { handleSignup } from '../handlers/authHandler';

const Signup: React.FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // await handleSignup({ email, password, name,id });
      // Redirect or update UI on successful signup
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Signup</button>
    </form>
  );
});

export default Signup;
