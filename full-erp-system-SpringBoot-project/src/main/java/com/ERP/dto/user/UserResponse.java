package com.ERP.dto.user;

import com.ERP.entity.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Boolean isActive;
    private Long employeeId;
    private String employeeName;
    private Set<String> roles;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setIsActive(user.getIsActive());
        r.setLastLogin(user.getLastLogin());
        r.setCreatedAt(user.getCreatedAt());
        if (user.getEmployee() != null) {
            r.setEmployeeId(user.getEmployee().getId());
            r.setEmployeeName(user.getEmployee().getFullName());
        }
        r.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet()));
        return r;
    }
}
