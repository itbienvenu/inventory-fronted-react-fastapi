import React, { useState } from 'react';
import "./styles/Login.css"
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/api/v1/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, user_data } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user_data));

      setMessage('Login successful!');
    } catch (error) {
      setMessage('Invalid email or password');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form id="LoginForm" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        If you dont't have an account click here to <a href='/register'>register</a>
      </p>
    </div>
  );
}

export default Login;

