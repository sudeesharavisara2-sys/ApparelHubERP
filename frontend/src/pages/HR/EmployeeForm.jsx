import React, { useState, useEffect } from 'react';
import { hrService } from '../../services/hrService';

export default function EmployeeForm({ existingEmployee, onSaveComplete, onCancel }) {
  const isEditMode = !!existingEmployee;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    nic: '',
    phone: '',
    address: '',
    department: '',
    role: 'Employee',
    dateOfJoining: '',
    basicSalary: 0,
    epfNo: '',
    age: '',
    birthday: ''
  });

  useEffect(() => {
    if (isEditMode && existingEmployee) {
      // Formats full timestamps down into short input dates (YYYY-MM-DD)
      const formatShortDate = (dt) => dt ? dt.split('T')[0] : '';
      
      setFormData({
        ...existingEmployee,
        dateOfJoining: formatShortDate(existingEmployee.dateOfJoining),
        birthday: formatShortDate(existingEmployee.birthday),
        basicSalary: existingEmployee.basicSalary || 0,
        age: existingEmployee.age || ''
      });
    }
  }, [existingEmployee, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basicSalary' || name === 'age' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format payloads to handle datetime strings appropriately
      const payload = {
        ...formData,
        dateOfJoining: formData.dateOfJoining ? `${formData.dateOfJoining}T09:00:00Z` : null,
        birthday: formData.birthday ? `${formData.birthday}T00:00:00Z` : null
      };

      if (isEditMode) {
        await hrService.updateEmployee(existingEmployee.id, payload);
        alert('Employee updated successfully!');
      } else {
        await hrService.createEmployee(payload);
        alert('Employee created successfully!');
      }
      onSaveComplete();
    } catch (err) {
      alert(`Error processing request: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h3>{isEditMode ? 'Edit Employee Info' : 'Onboard New Employee'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
        <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
        <label>Position: <input type="text" name="position" value={formData.position} onChange={handleChange} required /></label>
        <label>Department: <input type="text" name="department" value={formData.department} onChange={handleChange} /></label>
        <label>NIC: <input type="text" name="nic" value={formData.nic} onChange={handleChange} /></label>
        <label>Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} /></label>
        <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} /></label>
        <label>EPF Number: <input type="text" name="epfNo" value={formData.epfNo} onChange={handleChange} /></label>
        <label>Basic Salary: <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} /></label>
        <label>Age: <input type="number" name="age" value={formData.age} onChange={handleChange} /></label>
        <label>Birthday: <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} /></label>
        <label>Date of Joining: <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} /></label>
        
        <div>
          <button type="submit">{isEditMode ? 'Update' : 'Save'}</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}