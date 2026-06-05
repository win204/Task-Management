package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.entity.Role;

import java.util.List;

public interface RoleService {

    Role createRole(CreateRoleRequest request);

    List<Role> getAllRoles();

    Role getRoleById(Long id);

    void deleteRole(Long id);

    Role updateRole(Long id, CreateRoleRequest request);
}