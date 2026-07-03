package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.phong.taskmanagement.common.validation.UniqueUsername;
import com.phong.taskmanagement.common.validation.UniqueEmail;
import com.phong.taskmanagement.common.validation.ValidPassword;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @UniqueUsername
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @ValidPassword
    private String password;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @UniqueEmail
    private String email;

    @NotBlank(message = "Full name cannot be blank")
    private String fullName;
}
