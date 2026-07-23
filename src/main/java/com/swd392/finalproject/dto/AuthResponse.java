package com.swd392.finalproject.dto;

import com.swd392.finalproject.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String token;
    private String message;
}
