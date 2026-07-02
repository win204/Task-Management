DECLARE @MaxNormalId BIGINT = (SELECT ISNULL(MAX(id), 0) FROM activity_logs WHERE id < 10000);

CREATE TABLE #TempActivityLogs (
    new_id BIGINT,
    old_id BIGINT,
    action NVARCHAR(100),
    description NVARCHAR(MAX),
    module NVARCHAR(50),
    entity_id BIGINT,
    ip_address NVARCHAR(45),
    result NVARCHAR(20),
    created_at DATETIME2(6),
    user_id BIGINT,
    task_id BIGINT
);

INSERT INTO #TempActivityLogs (new_id, old_id, action, description, module, entity_id, ip_address, result, created_at, user_id, task_id)
SELECT 
    @MaxNormalId + ROW_NUMBER() OVER (ORDER BY id ASC),
    id,
    action, description, module, entity_id, ip_address, result, created_at, user_id, task_id
FROM activity_logs
WHERE id > 10000;

IF EXISTS (SELECT 1 FROM #TempActivityLogs)
BEGIN
    SET IDENTITY_INSERT activity_logs ON;

    INSERT INTO activity_logs (id, action, description, module, entity_id, ip_address, result, created_at, user_id, task_id)
    SELECT new_id, action, description, module, entity_id, ip_address, result, created_at, user_id, task_id
    FROM #TempActivityLogs;

    SET IDENTITY_INSERT activity_logs OFF;

    DELETE FROM activity_logs WHERE id > 10000;
END

DROP TABLE #TempActivityLogs;

DECLARE @m BIGINT = (SELECT ISNULL(MAX(id), 0) FROM activity_logs);
EXEC('DBCC CHECKIDENT(''activity_logs'', RESEED, ' + @m + ')');
