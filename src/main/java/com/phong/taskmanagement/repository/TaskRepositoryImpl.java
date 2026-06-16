package com.phong.taskmanagement.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.phong.taskmanagement.dto.request.TaskSearchRequest;
import com.phong.taskmanagement.entity.QTask;
import com.phong.taskmanagement.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TaskRepositoryImpl implements TaskRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Task> searchTasks(TaskSearchRequest request, Pageable pageable) {
        QTask task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            predicate.and(task.title.containsIgnoreCase(request.getTitle()));
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            predicate.and(task.status.eq(request.getStatus()));
        }

        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            predicate.and(task.priority.eq(request.getPriority()));
        }

        if (request.getAssigneeId() != null) {
            predicate.and(task.assignee().id.eq(request.getAssigneeId()));
        }

        if (request.getProjectId() != null) {
            predicate.and(task.project().id.eq(request.getProjectId()));
        }

        if (request.getDueDate() != null) {
            predicate.and(task.dueDate.eq(request.getDueDate()));
        }

        List<Task> tasks = queryFactory
                .selectFrom(task)
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(task)
                .where(predicate)
                .fetchCount();

        return new PageImpl<>(tasks, pageable, total);
    }
}

