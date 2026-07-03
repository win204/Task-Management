package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.request.LoginRequest;
import com.phong.taskmanagement.dto.request.ForgotPasswordRequest;
import com.phong.taskmanagement.dto.request.ResetPasswordRequest;
import com.phong.taskmanagement.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
