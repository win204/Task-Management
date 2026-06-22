import { useState } from 'react';
import { UserSearchBar } from '../../components/users/UserSearchBar';
import { UserTable } from '../../components/users/UserTable';
import { Pagination } from '../../components/users/Pagination';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import { EditUserModal } from '../../components/users/EditUserModal';
import { DeleteUserDialog } from '../../components/users/DeleteUserDialog';
import { UserDetailModal } from '../../components/users/UserDetailModal';
import { useUsersQuery } from '../../hooks/useUsers';
import type { User, UserSearchParams } from '../../types/user';

export default function UsersPage() {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 0,
    size: 10,
    keyword: '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useUsersQuery(searchParams);

  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage team members and their roles.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar Container */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700/50 bg-surface-50/50 dark:bg-surface-800/30">
          <UserSearchBar onSearch={handleSearch} onAddUser={() => setIsCreateModalOpen(true)} />
        </div>

        {/* Data Table Viewport */}
        <div className="flex-1 overflow-auto">
          <UserTable
            users={data?.content || []}
            isLoading={isLoading}
            error={error as Error}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Pagination Footer */}
        {data && (
           <Pagination
             currentPage={data.number}
             totalPages={data.totalPages}
             totalElements={data.totalElements}
             pageSize={data.size}
             onPageChange={handlePageChange}
           />
        )}
      </div>

      {/* Global Modals & Dialogs for this view */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedUser(null); }}
        user={selectedUser}
      />
    </div>
  );
}
