package com.phong.taskmanagement.domain.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTaskComment is a Querydsl query type for TaskComment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTaskComment extends EntityPathBase<TaskComment> {

    private static final long serialVersionUID = -2138148674L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTaskComment taskComment = new QTaskComment("taskComment");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    protected QTaskComment parent;

    public final ListPath<TaskComment, QTaskComment> replies = this.<TaskComment, QTaskComment>createList("replies", TaskComment.class, QTaskComment.class, PathInits.DIRECT2);

    protected QTask task;

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    protected QUser user;

    public QTaskComment(String variable) {
        this(TaskComment.class, forVariable(variable), INITS);
    }

    public QTaskComment(Path<? extends TaskComment> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTaskComment(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTaskComment(PathMetadata metadata, PathInits inits) {
        this(TaskComment.class, metadata, inits);
    }

    public QTaskComment(Class<? extends TaskComment> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.parent = inits.isInitialized("parent") ? new QTaskComment(forProperty("parent"), inits.get("parent")) : null;
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

    public QTaskComment parent() {
        if (parent == null) {
            parent = new QTaskComment(forProperty("parent"));
        }
        return parent;
    }

    public QTask task() {
        if (task == null) {
            task = new QTask(forProperty("task"));
        }
        return task;
    }

    public QUser user() {
        if (user == null) {
            user = new QUser(forProperty("user"));
        }
        return user;
    }

}

