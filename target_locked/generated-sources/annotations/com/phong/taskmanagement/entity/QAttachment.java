package com.phong.taskmanagement.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QAttachment is a Querydsl query type for Attachment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAttachment extends EntityPathBase<Attachment> {

    private static final long serialVersionUID = 1209431315L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QAttachment attachment = new QAttachment("attachment");

    public final StringPath fileName = createString("fileName");

    public final StringPath filePath = createString("filePath");

    public final NumberPath<Long> fileSize = createNumber("fileSize", Long.class);

    public final StringPath fileType = createString("fileType");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    protected QTask task;

    public final DateTimePath<java.time.LocalDateTime> uploadedAt = createDateTime("uploadedAt", java.time.LocalDateTime.class);

    protected QUser uploadedBy;

    public QAttachment(String variable) {
        this(Attachment.class, forVariable(variable), INITS);
    }

    public QAttachment(Path<? extends Attachment> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QAttachment(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QAttachment(PathMetadata metadata, PathInits inits) {
        this(Attachment.class, metadata, inits);
    }

    public QAttachment(Class<? extends Attachment> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
        this.uploadedBy = inits.isInitialized("uploadedBy") ? new QUser(forProperty("uploadedBy")) : null;
    }

    public QTask task() {
        if (task == null) {
            task = new QTask(forProperty("task"));
        }
        return task;
    }

    public QUser uploadedBy() {
        if (uploadedBy == null) {
            uploadedBy = new QUser(forProperty("uploadedBy"));
        }
        return uploadedBy;
    }

}

