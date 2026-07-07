import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import './HR.css';

export default function HRDashboard() {
  const [view, setView] = useState('LIST'); // Managed via structural tokens: 'LIST', 'FORM', 'DETAILS'
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  const showCreateForm = () => {
    setSelectedEmp(null);
    setView('FORM');
  };

  const showEditForm = (emp) => {
    setSelectedEmp(emp);
    setView('FORM');
  };

  const showDetails = (id) => {
    setSelectedEmpId(id);
    setView('DETAILS');
  };

  return (
    <div className="hr-dashboard-wrapper" style={{ padding: '20px' }}>
      <h1>ApparelHub ERP — Human Resources Module</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('LIST')}>Directory Grid</button>
        <button onClick={showCreateForm} style={{ marginLeft: '10px', background: '#28a745', color: '#fff' }}>
          Onboard New Hire
        </button>
      </div>

      <hr />

      {view === 'LIST' && (
        <EmployeeList onEdit={showEditForm} onViewDetails={showDetails} />
      )}

      {view === 'FORM' && (
        <EmployeeForm 
          existingEmployee={selectedEmp} 
          onSaveComplete={() => setView('LIST')} 
          onCancel={() => setView('LIST')} 
        />
      )}

      {view === 'DETAILS' && (
        <EmployeeDetails 
          employeeId={selectedEmpId} 
          onClose={() => setView('LIST')} 
        />
      )}
    </div>
  );
}