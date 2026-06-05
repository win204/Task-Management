package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.repository.RoleRepository;
import com.phong.taskmanagement.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role createRole(CreateRoleRequest request) {

        Role role = Role.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow();
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public Role updateRole(Long id, CreateRoleRequest request) {
        Role role = getRoleById(id);

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        return roleRepository.save(role);
    }
}