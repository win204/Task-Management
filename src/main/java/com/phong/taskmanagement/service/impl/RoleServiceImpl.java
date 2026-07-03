package com.phong.taskmanagement.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateRoleRequest;
import com.phong.taskmanagement.domain.entity.Role;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.RoleRepository;
import com.phong.taskmanagement.service.interfaces.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl
        implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role createRole(
            CreateRoleRequest request) {

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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found"
                        ));
    }

    @Override
    public void deleteRole(Long id) {

        if (!roleRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Role not found"
            );
        }

        roleRepository.deleteById(id);
    }

    @Override
    public Role updateRole(
            Long id,
            CreateRoleRequest request) {

        Role role = getRoleById(id);

        role.setName(request.getName());
        role.setDescription(
                request.getDescription()
        );

        return roleRepository.save(role);
    }

    @Override
    public Page<Role> searchRoles(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return roleRepository
                .findByNameContainingIgnoreCase(
                        keyword,
                        pageable
                );
    }

    @Override
    public Page<Role> getRolesWithPaging(
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return roleRepository.findAll(
                pageable
        );
    }
}
