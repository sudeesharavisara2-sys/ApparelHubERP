package com.ERP.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequest {

    @Email
    private String email;

    private Boolean isActive;

    private Long employeeId;

    private Set<String> roles;
}
