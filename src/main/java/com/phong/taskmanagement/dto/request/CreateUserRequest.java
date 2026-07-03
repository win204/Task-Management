package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import com.phong.taskmanagement.common.validation.UniqueUsername;
import com.phong.taskmanagement.common.validation.UniqueEmail;
import com.phong.taskmanagement.common.validation.ValidPassword;
import lombok.Data;
import java.util.List;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username từ 3 đến 50 ký tự")
    @UniqueUsername
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password tối thiểu 6 ký tự")
    @ValidPassword
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @UniqueEmail
    private String email;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotNull(message = "Danh sách role không được để trống")
    private List<String> roles;

    @NotNull(message = "Trạng thái active không được để trống")
    private Boolean active;
}
