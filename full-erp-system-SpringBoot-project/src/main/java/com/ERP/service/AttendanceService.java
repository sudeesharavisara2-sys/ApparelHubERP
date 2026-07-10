package com.ERP.service;

import com.ERP.entity.Attendance;
import com.ERP.exception.ResourceNotFoundException;
import com.ERP.repository.AttendanceRepository;
import com.ERP.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<Attendance> getByEmployee(Long employeeId, LocalDate start, LocalDate end) {
        return attendanceRepository.findByEmployeeAndDateRange(employeeId, start, end);
    }

    public List<Attendance> getByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Transactional
    public Attendance save(Attendance attendance) {
        if (attendance.getEmployee() != null && attendance.getEmployee().getId() != null) {
            attendance.setEmployee(employeeRepository.findById(attendance.getEmployee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found")));
        }
        return attendanceRepository.save(attendance);
    }

    public Attendance getById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found: " + id));
    }
}
