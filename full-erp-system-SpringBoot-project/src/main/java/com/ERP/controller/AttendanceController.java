package com.ERP.controller;

import com.ERP.dto.ApiResponse;
import com.ERP.entity.Attendance;
import com.ERP.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByEmployee(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByEmployee(employeeId, start, end)));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByDate(date)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Attendance>> save(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(ApiResponse.success("Attendance saved", attendanceService.save(attendance)));
    }
}
