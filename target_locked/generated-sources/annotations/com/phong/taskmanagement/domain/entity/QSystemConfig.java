package com.phong.taskmanagement.domain.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSystemConfig is a Querydsl query type for SystemConfig
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSystemConfig extends EntityPathBase<SystemConfig> {

    private static final long serialVersionUID = -805910739L;

    public static final QSystemConfig systemConfig = new QSystemConfig("systemConfig");

    public final StringPath configKey = createString("configKey");

    public final StringPath configValue = createString("configValue");

    public final StringPath description = createString("description");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final StringPath updatedBy = createString("updatedBy");

    public QSystemConfig(String variable) {
        super(SystemConfig.class, forVariable(variable));
    }

    public QSystemConfig(Path<? extends SystemConfig> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSystemConfig(PathMetadata metadata) {
        super(SystemConfig.class, metadata);
    }

}

