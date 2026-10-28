import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', employeeId: '', designation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setForm({
          name: data.name,
          employeeId: data.employeeId,
          designation: data.designation,
        });
      } catch (err) {
        setError('Failed to load employee');
      } finally {
        setFetching(false);
      }
    };
    loadEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/employees/${id}`, form);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="formContainer">Loading...</div>;
  }

  return (
    <div className="formContainer">
      <h1>Edit Employee</h1>
      {error && <p className="errorMsg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="formWrapper">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="formWrapper">
          <label>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
          />
        </div>
        <div className="formWrapper">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}
