import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', employeeId: '', designation: '' });
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
      await api.post('/employees', form);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <h1>Create Employee</h1>
      {error && <p className="errorMsg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="formWrapper">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="formWrapper">
          <label>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            placeholder="Enter Your Employee ID"
            value={form.employeeId}
            onChange={handleChange}
          />
        </div>
        <div className="formWrapper">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            placeholder="Enter Your Designation"
            value={form.designation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
