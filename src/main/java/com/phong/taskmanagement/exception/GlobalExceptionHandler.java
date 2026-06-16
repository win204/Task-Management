package com.phong.taskmanagement.exception;

import com.phong.taskmanagement.dto.response.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Object> handleNotFound(
            ResourceNotFoundException ex) {

        return ApiResponse.failure(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleValidation(
            MethodArgumentNotValidException ex) {

        return ApiResponse.failure(
                ex.getBindingResult()
                        .getFieldError()
                        .getDefaultMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleIllegalArgument(
            IllegalArgumentException ex) {

        return ApiResponse.failure(ex.getMessage());
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Object> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex) {

        return ApiResponse.failure(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleException(
            Exception ex) {

        return ApiResponse.failure("Internal server error");
    }
}
