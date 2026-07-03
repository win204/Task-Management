package com.phong.taskmanagement.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QActivityLog is a Querydsl query type for ActivityLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QActivityLog extends EntityPathBase<ActivityLog> {

    private static final long serialVersionUID = -1340634171L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QActivityLog activityLog = new QActivityLog("activityLog");

    public final StringPath action = createString("action");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    public final NumberPath<Long> entityId = createNumber("entityId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath ipAddress = createString("ipAddress");

    public final StringPath module = createString("module");

    public final StringPath result = createString("result");

    protected QTask task;

    protected QUser user;

    public QActivityLog(String variable) {
        this(ActivityLog.class, forVariable(variable), INITS);
    }

    public QActivityLog(Path<? extends ActivityLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QActivityLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QActivityLog(PathMetadata metadata, PathInits inits) {
        this(ActivityLog.class, metadata, inits);
    }

    public QActivityLog(Class<? extends ActivityLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
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

