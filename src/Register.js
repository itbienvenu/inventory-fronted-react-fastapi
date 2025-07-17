import React, { useState } from 'react';
import axios from 'axios';
import './styles/Register.css'; 

function Register() {
  const [formData, setFormData] = useState({
    names: '',
    email: '',
    phone: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/v1/register', formData);
      setMessage('Registration successful. You can now log in!');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="Register">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="names" value={formData.names} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
