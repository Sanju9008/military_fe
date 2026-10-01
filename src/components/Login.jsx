import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { username, password });
      const { token, username: resUser, role, baseId } = response.data;

      const userData = { username: resUser, role, baseId };
      login(token, userData);

      navigate('/dashboard');
    } catch (err) {
      if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Military Asset Management</h2>
        <h4 style={styles.subtitle}>Sign In</h4>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  form: {
    width: '350px',
    padding: '30px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 5px 0',
    color: '#1a202c',
    fontSize: '20px',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 20px 0',
    color: '#718096',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  error: {
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '4px',
    fontSize: '14px',
  },
  group: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#4a5568',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3182ce',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Login;
