package com.phong.taskmanagement.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTask is a Querydsl query type for Task
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTask extends EntityPathBase<Task> {

    private static final long serialVersionUID = 1511327093L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTask task = new QTask("task");

    protected QUser assignee;

    public final StringPath description = createString("description");

    public final DatePath<java.time.LocalDate> dueDate = createDate("dueDate", java.time.LocalDate.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath priority = createString("priority");

    protected QProject project;

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final StringPath status = createString("status");

    public final StringPath title = createString("title");

    public QTask(String variable) {
        this(Task.class, forVariable(variable), INITS);
    }

    public QTask(Path<? extends Task> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTask(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTask(PathMetadata metadata, PathInits inits) {
        this(Task.class, metadata, inits);
    }

    public QTask(Class<? extends Task> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.assignee = inits.isInitialized("assignee") ? new QUser(forProperty("assignee")) : null;
        this.project = inits.isInitialized("project") ? new QProject(forProperty("project")) : null;
    }

    public QUser assignee() {
        if (assignee == null) {
            assignee = new QUser(forProperty("assignee"));
        }
        return assignee;
    }

    public QProject project() {
        if (project == null) {
            project = new QProject(forProperty("project"));
        }
        return project;
    }

}

