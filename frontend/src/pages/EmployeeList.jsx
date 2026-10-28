import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      loadEmployees();
      return;
    }
    try {
      const { data } = await api.get(`/employees/search/${encodeURIComponent(search)}`);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearSearch = () => {
    setSearch('');
    loadEmployees();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      // ignore - token may already be invalid
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div>
      <div className="logout">
        <button type="button" className="btn Createbtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSearch} className="textCenter">
        <input
          type="text"
          placeholder="Search Here...."
          className="searchField"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button id="clearBtn" type="button" onClick={clearSearch}>
          Clear
        </button>
      </form>

      <div className="tableContainer">
        <div className="tableTitle">
          <h1>Employees</h1>
          <Link to="/employees/create" className="btn Createbtn">
            Create Employee
          </Link>
        </div>

        <table border="1" className="dataTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="5">No employees found</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <Link to={`/employees/${employee.id}/edit`} title="Edit">
                      Edit
                    </Link>
                    {' | '}
                    <button
                      type="button"
                      className="deleteBtn"
                      title="Delete"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
