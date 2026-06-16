package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(
        name = "Role API",
        description = "APIs for managing roles"
)
public class RoleController {

    private final RoleService roleService;

    @Operation(
            summary = "Create new role",
            description = "Create a new role"
    )
    @PostMapping
    public ApiResponse<Role> createRole(
            @RequestBody CreateRoleRequest request) {

        Role response = roleService.createRole(request);
        return ApiResponse.success(response, "Role created successfully");
    }

    @Operation(
            summary = "Get all roles",
            description = "Retrieve all roles"
    )
    @GetMapping
    public ApiResponse<List<Role>> getAllRoles() {

        List<Role> response = roleService.getAllRoles();
        return ApiResponse.success(response, "Roles retrieved successfully");
    }

    @Operation(
            summary = "Get role by id",
            description = "Retrieve a role by id"
    )
    @GetMapping("/{id}")
    public ApiResponse<Role> getRoleById(
            @PathVariable Long id) {

        Role response = roleService.getRoleById(id);
        return ApiResponse.success(response, "Role retrieved successfully");
    }

    @Operation(
            summary = "Search roles",
            description = "Search roles by keyword with pagination"
    )
    @GetMapping("/search")
    public ApiResponse<Page<Role>> searchRoles(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<Role> response = roleService.searchRoles(
                keyword,
                page,
                size
        );
        return ApiResponse.success(response, "Roles searched successfully");
    }

    @Operation(
            summary = "Get roles with pagination",
            description = "Retrieve roles with pagination"
    )
    @GetMapping("/paging")
    public ApiResponse<Page<Role>> getRolesWithPaging(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<Role> response = roleService.getRolesWithPaging(
                page,
                size
        );
        return ApiResponse.success(response, "Roles retrieved with pagination successfully");
    }

    @Operation(
            summary = "Delete role",
            description = "Delete a role by id"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRole(
            @PathVariable Long id) {

        roleService.deleteRole(id);
        return ApiResponse.success(null, "Role deleted successfully");
    }

    @Operation(
            summary = "Update role",
            description = "Update role information"
    )
    @PutMapping("/{id}")
    public ApiResponse<Role> updateRole(
            @PathVariable Long id,
            @RequestBody CreateRoleRequest request) {

        Role response = roleService.updateRole(
                id,
                request
        );
        return ApiResponse.success(response, "Role updated successfully");
    }
}