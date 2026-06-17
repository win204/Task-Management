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

    @ExceptionHandler({
            org.springframework.security.authorization.AuthorizationDeniedException.class,
            org.springframework.security.access.AccessDeniedException.class
    })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse<Object> handleAccessDenied(Exception ex) {
        return ApiResponse.failure("Access denied: You do not have permission to perform this action.");
    }

    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Object> handleEntityNotFound(jakarta.persistence.EntityNotFoundException ex) {
        return ApiResponse.failure("Resource not found.");
    }

    @ExceptionHandler({
            org.springframework.dao.DataIntegrityViolationException.class,
            jakarta.validation.ConstraintViolationException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleDataIntegrityViolation(Exception ex) {
        // If it's our custom message, return it directly. Otherwise return a generic safe message.
        if (ex.getMessage() != null && ex.getMessage().contains("Cannot delete")) {
            return ApiResponse.failure(ex.getMessage());
        }
        return ApiResponse.failure("Database constraint violation or data integrity issue.");
    }

    @ExceptionHandler(org.hibernate.LazyInitializationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleLazyInitialization(org.hibernate.LazyInitializationException ex) {
        return ApiResponse.failure("Internal server error: A lazy collection was accessed outside of an active transaction.");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleException(
            Exception ex) {

        return ApiResponse.failure("Internal server error");
    }
}
