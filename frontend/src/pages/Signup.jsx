import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <h2 className="regTitle">Signup</h2>
      {error && <p className="errorMsg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="formWrapper">
          <label>Full Name</label>
          <input
            type="text"
            name="fName"
            placeholder="Enter your Fullname"
            value={form.fName}
            onChange={handleChange}
          />
        </div>
        <div className="formWrapper">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="formWrapper">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Register'}
        </button>
      </form>
      <p className="loginCt">
        Already Have an Account! <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
