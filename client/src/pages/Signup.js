import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  await axios.post('/api/auth/signup', { name, email, password });

    navigate('/signin');
  } catch (err) {
    console.error('Full error:', err); // This is important

    let errorMessage = 'Signup failed. Please try again.';

    // Safely check if response and data exist
    if (err.response && err.response.data) {
      errorMessage =
        err.response.data.error ||
        err.response.data.message ||
        errorMessage;
    } else if (err.message) {
      errorMessage = err.message;
    }

    alert(errorMessage);
  }
};




  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
  );
}
