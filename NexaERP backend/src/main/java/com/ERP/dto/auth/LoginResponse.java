package com.ERP.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String email;
    private Set<String> roles;
}
