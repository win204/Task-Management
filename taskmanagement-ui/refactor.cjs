const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    const oldContent = content;
    
    // Auth
    content = content.replace(/['"](\.\.\/)*features\/auth\/(api|store|types|pages|validations)\/([^'"]+)['"]/g, "'@/features/auth/$2/$3'");
    content = content.replace(/['"](\.\.\/)*utils\/([^'"]+)['"]/g, "'@/utils/$2'");
    content = content.replace(/['"](\.\.\/)*services\/AuthService['"]/g, "'@/features/auth/api/AuthService'");
    content = content.replace(/['"](\.\.\/)*store\/authStore['"]/g, "'@/features/auth/store/authStore'");
    content = content.replace(/['"](\.\.\/)*types\/auth['"]/g, "'@/features/auth/types/auth'");
    content = content.replace(/['"](\.\.\/)*validations\/authSchema['"]/g, "'@/features/auth/validations/authSchema'");
    content = content.replace(/['"](\.\.\/)*pages\/auth\/([^'"]+)['"]/g, "'@/features/auth/pages/$2'");

    // Dashboard
    content = content.replace(/['"](\.\.\/)*types\/dashboard['"]/g, "'@/features/dashboard/types/dashboard'");
    content = content.replace(/['"](\.\.\/)*services\/DashboardService['"]/g, "'@/features/dashboard/api/DashboardService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/DashboardPage['"]/g, "'@/features/dashboard/pages/DashboardPage'");
    content = content.replace(/['"](\.\.\/)*hooks\/useDashboard['"]/g, "'@/features/dashboard/hooks/useDashboard'");
    content = content.replace(/['"](\.\.\/)*components\/dashboard\/([^'"]+)['"]/g, "'@/features/dashboard/components/$2'");

    // Users
    content = content.replace(/['"](\.\.\/)*types\/user['"]/g, "'@/features/users/types/user'");
    content = content.replace(/['"](\.\.\/)*services\/UserService['"]/g, "'@/features/users/api/UserService'");
    content = content.replace(/['"](\.\.\/)*services\/RoleService['"]/g, "'@/features/users/api/RoleService'");
    content = content.replace(/['"](\.\.\/)*services\/PositionService['"]/g, "'@/features/users/api/PositionService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/UsersPage['"]/g, "'@/features/users/pages/UsersPage'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/RolesPage['"]/g, "'@/features/users/pages/RolesPage'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/PositionsPage['"]/g, "'@/features/users/pages/PositionsPage'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/ProfilePage['"]/g, "'@/features/users/pages/ProfilePage'");
    content = content.replace(/['"](\.\.\/)*hooks\/useUsers['"]/g, "'@/features/users/hooks/useUsers'");
    content = content.replace(/['"](\.\.\/)*components\/users\/([^'"]+)['"]/g, (match, p1, p2) => {
        if (p2 === 'Pagination') return "'@/components/common/Pagination'";
        return `'@/features/users/components/${p2}'`;
    });

    // Projects
    content = content.replace(/['"](\.\.\/)*types\/project['"]/g, "'@/features/projects/types/project'");
    content = content.replace(/['"](\.\.\/)*services\/ProjectService['"]/g, "'@/features/projects/api/ProjectService'");
    content = content.replace(/['"](\.\.\/)*services\/ProjectMemberService['"]/g, "'@/features/projects/api/ProjectMemberService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/ProjectsPage['"]/g, "'@/features/projects/pages/ProjectsPage'");
    content = content.replace(/['"](\.\.\/)*components\/projects\/([^'"]+)['"]/g, "'@/features/projects/components/$2'");
    content = content.replace(/['"](\.\.\/)*hooks\/useProjects['"]/g, "'@/features/projects/hooks/useProjects'");

    // Tasks
    content = content.replace(/['"](\.\.\/)*types\/task['"]/g, "'@/features/tasks/types/task'");
    content = content.replace(/['"](\.\.\/)*services\/TaskService['"]/g, "'@/features/tasks/api/TaskService'");
    content = content.replace(/['"](\.\.\/)*services\/TaskCommentService['"]/g, "'@/features/tasks/api/TaskCommentService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/TasksPage['"]/g, "'@/features/tasks/pages/TasksPage'");
    content = content.replace(/['"](\.\.\/)*components\/tasks\/([^'"]+)['"]/g, "'@/features/tasks/components/$2'");
    content = content.replace(/['"](\.\.\/)*components\/kanban\/([^'"]+)['"]/g, "'@/features/tasks/components/kanban/$2'");
    content = content.replace(/['"](\.\.\/)*hooks\/useTasks['"]/g, "'@/features/tasks/hooks/useTasks'");
    content = content.replace(/['"](\.\.\/)*hooks\/useKanban['"]/g, "'@/features/tasks/hooks/useKanban'");

    // Notifications
    content = content.replace(/['"](\.\.\/)*types\/notification['"]/g, "'@/features/notifications/types/notification'");
    content = content.replace(/['"](\.\.\/)*services\/NotificationService['"]/g, "'@/features/notifications/api/NotificationService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/NotificationsPage['"]/g, "'@/features/notifications/pages/NotificationsPage'");
    content = content.replace(/['"](\.\.\/)*hooks\/useNotifications['"]/g, "'@/features/notifications/hooks/useNotifications'");

    // Settings
    content = content.replace(/['"](\.\.\/)*services\/SystemConfigService['"]/g, "'@/features/settings/api/SystemConfigService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/SettingsPage['"]/g, "'@/features/settings/pages/SettingsPage'");

    // Reports
    content = content.replace(/['"](\.\.\/)*services\/ReportService['"]/g, "'@/features/reports/api/ReportService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/ReportsPage['"]/g, "'@/features/reports/pages/ReportsPage'");

    // Activity
    content = content.replace(/['"](\.\.\/)*services\/ActivityLogService['"]/g, "'@/features/activity/api/ActivityLogService'");
    content = content.replace(/['"](\.\.\/)*pages\/dashboard\/ActivityLogsPage['"]/g, "'@/features/activity/pages/ActivityLogsPage'");

    // General imports fixes
    content = content.replace(/['"](\.\.\/)*api\/axios['"]/g, "'@/api/axios'");
    content = content.replace(/['"](\.\.\/)*utils\/constants['"]/g, "'@/utils/constants'");
    content = content.replace(/['"](\.\.\/)*services\/WebSocketService['"]/g, "'@/services/WebSocketService'");

    if (content !== oldContent) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
