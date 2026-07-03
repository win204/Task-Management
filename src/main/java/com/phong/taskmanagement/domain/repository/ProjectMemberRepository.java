package com.phong.taskmanagement.domain.repository;

import com.phong.taskmanagement.domain.entity.Project;
import com.phong.taskmanagement.domain.entity.ProjectMember;
import com.phong.taskmanagement.domain.entity.ProjectMemberId;
import com.phong.taskmanagement.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, ProjectMemberId> {
    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByUserId(Long userId);
    void deleteByProjectAndUser(Project project, User user);
    boolean existsByProjectAndUser(Project project, User user);
    void deleteByUser(User user);
}
