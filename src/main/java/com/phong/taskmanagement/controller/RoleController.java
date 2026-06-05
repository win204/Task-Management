package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public Role createRole(@RequestBody CreateRoleRequest request) {
        return roleService.createRole(request);
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
    }

    @PutMapping("/{id}")
    public Role updateRole(
            @PathVariable Long id,
            @RequestBody CreateRoleRequest request) {

        return roleService.updateRole(id, request);
    }
}
