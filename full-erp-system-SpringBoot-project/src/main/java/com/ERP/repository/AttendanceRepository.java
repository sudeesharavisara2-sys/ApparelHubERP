package com.ERP.repository;

import com.ERP.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND " +
           "a.date BETWEEN :start AND :end ORDER BY a.date")
    List<Attendance> findByEmployeeAndDateRange(Long employeeId, LocalDate start, LocalDate end);

    @Query("SELECT a FROM Attendance a WHERE a.date = :date ORDER BY a.employee.fullName")
    List<Attendance> findByDate(LocalDate date);
}
