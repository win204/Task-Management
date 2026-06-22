-- This script runs once when the SQL Server container first starts.
-- It creates the application database if it does not already exist.
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'task_management')
BEGIN
    CREATE DATABASE task_management;
    PRINT 'Database task_management created.';
END
ELSE
BEGIN
    PRINT 'Database task_management already exists.';
END
GO
