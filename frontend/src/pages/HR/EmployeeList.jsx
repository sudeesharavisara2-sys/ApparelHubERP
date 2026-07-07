import React, { useEffect, useState } from 'react';
import { hrService } from '../../services/hrService';

export default function EmployeeList({ onEdit, onViewDetails }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await hrService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        await hrService.deleteEmployee(id);
        alert('Employee deactivated successfully.');
        loadEmployees(); // Refresh data
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Loading records...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="employee-list-container">
      <h2>Employee Directory</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>EPF No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.epfNo || 'N/A'}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.department || 'N/A'}</td>
              <td>
                <span className={`status-badge ${emp.status?.toLowerCase()}`}>
                  {emp.status || 'Active'}
                </span>
              </td>
              <td>
                <button onClick={() => onViewDetails(emp.id)}>View</button>
                <button onClick={() => onEdit(emp)}>Edit</button>
                {emp.status !== 'Deleted' && emp.status !== 'Inactive' && (
                  <button onClick={() => handleDeactivate(emp.id)} style={{ color: 'red' }}>
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}