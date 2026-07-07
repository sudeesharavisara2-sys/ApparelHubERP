const API_URL = 'https://localhost:7270/api/Employee';

// Helper to get auth headers dynamically
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Adjust key if your AuthContext uses a different name
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const hrService = {
  // GET /api/Employee
  getAllEmployees: async () => {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  // GET /api/Employee/{id}
  getEmployeeById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch employee details');
    return res.json();
  },

  // POST /api/Employee
  createEmployee: async (employeeData) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });
    if (!res.ok) throw new Error('Failed to create employee');
    return res.json();
  },

  // PUT /api/Employee/{id}
  updateEmployee: async (id, employeeData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return res.json();
  },

  // DELETE /api/Employee/{id} (Deactivates employee)
  deleteEmployee: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to deactivate employee');
    return res.json();
  },

  // GET /api/Employee/deleted
  getDeletedEmployees: async () => {
    const res = await fetch(`${API_URL}/deleted`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch deleted employees');
    return res.json();
  },

  // PATCH /api/Employee/{id}/status
  updateStatus: async (id, statusData) => {
    // statusData = { newStatus: "Inactive", reason: "Resigned" }
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // GET /api/Employee/{id}/status-logs
  getStatusLogs: async (id) => {
    const res = await fetch(`${API_URL}/${id}/status-logs`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch status logs');
    return res.json();
  },

  // PATCH /api/Employee/{id}/role
  updateRole: async (id, roleData) => {
    // roleData = { newRole: "Manager" }
    const res = await fetch(`${API_URL}/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  }
};