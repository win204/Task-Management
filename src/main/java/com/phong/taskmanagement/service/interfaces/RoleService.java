package com.phong.taskmanagement.service.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.domain.entity.Role;

public interface RoleService {

    Role createRole(CreateRoleRequest request);

    List<Role> getAllRoles();

    Role getRoleById(Long id);

    void deleteRole(Long id);

    Role updateRole(
            Long id,
            CreateRoleRequest request
    );

    Page<Role> searchRoles(
            String keyword,
            int page,
            int size
    );

    Page<Role> getRolesWithPaging(
            int page,
            int size
    );
}

