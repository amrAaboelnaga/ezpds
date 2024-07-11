import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { handleSignup } from '../handlers/authHandler';
const id = ""

const Signup: React.FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await handleSignup({ id, email, password, name });
      // Redirect or update UI on successful signup
    } catch (error) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={onSubmit} style={styles.form}>
        <h2 style={styles.heading}>Signup</h2>
        <p style={styles.errorMsg}>{error && (error)}</p>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? 'Loading...' : 'Signup'}
        </button>
      </form>
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
  form: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  heading: {
    textAlign: 'center' as const,
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'relative' as const,
  },
  errorMsg: {
    color: 'red',
    textAlign: 'center' as const,
    marginBottom: '10px',
  },
};

export default Signup;
