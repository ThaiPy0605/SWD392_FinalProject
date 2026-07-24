package com.swd392.finalproject.service;

import com.swd392.finalproject.dto.AuthResponse;
import com.swd392.finalproject.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);
}
