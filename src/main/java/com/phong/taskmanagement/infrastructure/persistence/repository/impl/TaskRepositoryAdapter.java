package com.phong.taskmanagement.infrastructure.persistence.repository.impl;

import com.phong.taskmanagement.domain.model.Task;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Infrastructure implementation of the Domain TaskRepository.
 * This class connects the Clean Architecture domain to Spring Data JPA.
 */
@Repository("cleanTaskRepositoryImpl")
@RequiredArgsConstructor
public class TaskRepositoryAdapter implements TaskRepository {

    // Using the EXISTING JPA repository for the sample mapping
    private final com.phong.taskmanagement.repository.TaskRepository springDataJpaRepository;

    @Override
    public Task save(Task domainTask) {
        // Map Domain Model -> JPA Entity
        com.phong.taskmanagement.entity.Task jpaEntity = new com.phong.taskmanagement.entity.Task();
        jpaEntity.setId(domainTask.getId());
        jpaEntity.setTitle(domainTask.getTitle());
        jpaEntity.setDescription(domainTask.getDescription());
        jpaEntity.setStatus(domainTask.getStatus());
        jpaEntity.setDueDate(domainTask.getDueDate());
        
        // Save using Spring Data
        com.phong.taskmanagement.entity.Task savedEntity = springDataJpaRepository.save(jpaEntity);
        
        // Map JPA Entity -> Domain Model
        return mapToDomain(savedEntity);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return springDataJpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Task> findAll() {
        return springDataJpaRepository.findAll().stream()
                .map(this::mapToDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        springDataJpaRepository.deleteById(id);
    }

    private Task mapToDomain(com.phong.taskmanagement.entity.Task entity) {
        return Task.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .dueDate(entity.getDueDate())
                .build();
    }
}
