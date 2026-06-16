package com.phong.taskmanagement.security;

public enum RoleName {

    ROLE_ADMIN,
    ROLE_MANAGER,
    ROLE_EMPLOYEE;

    public String getAuthority() {
        return name();
    }

    public String getSimpleName() {
        return name().replace("ROLE_", "");
    }

    public static RoleName fromString(String role) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role name must not be null or blank");
        }

        String normalized = role.trim();

        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring(5);
        }

        return RoleName.valueOf("ROLE_" + normalized.toUpperCase());
    }
}
