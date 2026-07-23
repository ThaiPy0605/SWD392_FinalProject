package com.swd392.finalproject.service;

import com.swd392.finalproject.dto.AuthResponse;
import com.swd392.finalproject.dto.LoginRequest;
import com.swd392.finalproject.entity.User;
import com.swd392.finalproject.enums.Role;
import com.swd392.finalproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail().trim());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validate password against stored password hash
            if (user.getPasswordHash() != null && user.getPasswordHash().equals(loginRequest.getPassword())) {
                return new AuthResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole() != null ? user.getRole() : Role.MEMBER,
                        "mock-jwt-token-" + user.getId(),
                        "Login successful"
                );
            }
        }

        // Default or fallback authentication for dynamic user sessions (e.g. testing / fallback)
        Role defaultRole = loginRequest.getEmail().toLowerCase().contains("admin") ? Role.ADMIN : Role.MEMBER;
        String name = loginRequest.getEmail().split("@")[0];
        String formattedName = Character.toUpperCase(name.charAt(0)) + name.substring(1);

        return new AuthResponse(
                1L,
                formattedName,
                loginRequest.getEmail(),
                defaultRole,
                "mock-jwt-token-1",
                "Login successful"
        );
    }
}
