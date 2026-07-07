import React, { useEffect, useState } from 'react';
import { hrService } from '../../services/hrService';

export default function EmployeeDetails({ employeeId, onClose }) {
  const [details, setDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [statusChange, setStatusChange] = useState({ newStatus: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      fetchFullDetails();
    }
  }, [employeeId]);

  const fetchFullDetails = async () => {
    try {
      setLoading(true);
      const empData = await hrService.getEmployeeById(employeeId);
      const logData = await hrService.getStatusLogs(employeeId);
      setDetails(empData);
      setLogs(logData);
    } catch (err) {
      alert('Error fetching detailed profiles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    try {
      await hrService.updateRole(employeeId, { newRole });
      alert('System security role altered successfully.');
      fetchFullDetails();
    } catch (err) { alert(err.message); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await hrService.updateStatus(employeeId, statusChange);
      alert('Status transitioned successfully.');
      fetchFullDetails();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div>Assembling Profile View...</div>;
  if (!details) return <div>No profile metadata loaded.</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '15px' }}>
      <button onClick={onClose} style={{ float: 'right' }}>Close File</button>
      <h2>Profile View: {details.name} (ID: {details.id})</h2>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        <div>
          <p><strong>Current Access Role:</strong> {details.role || 'None Assigned'}</p>
          <p><strong>Employment Status:</strong> {details.status}</p>
          <p><strong>Monthly Basic Salary:</strong> LKR {details.basicSalary}</p>
          <p><strong>Address:</strong> {details.address || 'Not Provided'}</p>
        </div>

        {/* Administration Actions Panel */}
        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
          <h4>Administrative Utilities</h4>
          
          <form onSubmit={handleRoleUpdate} style={{ marginBottom: '15px' }}>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} required>
              <option value="">-- Change System Role --</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" style={{ marginLeft: '5px' }}>Patch Role</button>
          </form>

          <form onSubmit={handleStatusUpdate}>
            <input 
              type="text" 
              placeholder="New Status (e.g., Inactive, Active)" 
              value={statusChange.newStatus}
              onChange={e => setStatusChange(p => ({ ...p, newStatus: e.target.value }))}
              required 
            />
            <input 
              type="text" 
              placeholder="Reason for change" 
              value={statusChange.reason}
              onChange={e => setStatusChange(p => ({ ...p, reason: e.target.value }))}
              required 
            />
            <button type="submit">Patch Status</button>
          </form>
        </div>
      </div>

      <h3>Status Modification Audit History Logs</h3>
      <ul>
        {logs.map(log => (
          <li key={log.logId}>
            [{new Date(log.changedAt).toLocaleString()}] <strong>{log.previousStatus || 'Initial'}</strong> → <strong>{log.newStatus}</strong> | Reason: "{log.reason}" by {log.changedBy || 'system'}
          </li>
        ))}
      </ul>
    </div>
  );
}