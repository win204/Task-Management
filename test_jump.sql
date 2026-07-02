SET IDENTITY_INSERT activity_logs ON;
INSERT INTO activity_logs (id, action) VALUES (20000, 'TEST_JUMP');
SET IDENTITY_INSERT activity_logs OFF;
DBCC CHECKIDENT('activity_logs', RESEED, 7);
