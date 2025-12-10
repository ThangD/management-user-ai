'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Shield, Plus, Edit, Trash2, Key, X, Search, Users, ShieldCheck, Lock } from 'lucide-react';
import api from '@/lib/api'; // Assuming '@/lib/api' is configured with axios and JWT

// Define Role and Permission interfaces as per requirements
interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissionCount: number;
  rolePermissions: Array<{
    permission: {
      id: string;
      name: string;
      resource: string;
      action: string;
    };
  }>;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Type for managing modal visibility
type ModalType = 'create' | 'edit' | 'delete' | 'assignPermissions' | null;

const RolesManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // States for modals
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [assigningPermissionsRole, setAssigningPermissionsRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]); // For assign permissions modal

  // Form states for Create/Edit Role
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  // --- API Calls ---

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch roles.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      setPermissions(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch permissions.';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Modal Handlers ---

  const openCreateModal = () => {
    setRoleName('');
    setRoleDescription('');
    setActiveModal('create');
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setActiveModal('edit');
  };

  const openDeleteModal = (role: Role) => {
    setDeletingRole(role);
    setActiveModal('delete');
  };

  const openAssignPermissionsModal = (role: Role) => {
    setAssigningPermissionsRole(role);
    // Pre-select permissions already assigned to this role
    const currentPermissionIds = role.rolePermissions.map(rp => rp.permission.id);
    setSelectedPermissions(currentPermissionIds);
    setActiveModal('assignPermissions');
  };

  const closeModals = () => {
    setActiveModal(null);
    setEditingRole(null);
    setDeletingRole(null);
    setAssigningPermissionsRole(null);
    setSelectedPermissions([]);
    setError(null); // Clear any previous modal-specific errors
  };

  // --- API Action Handlers ---

  const handleCreateRole = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await api.post('/roles', { name: roleName, description: roleDescription });
      alert('Role created successfully!');
      closeModals();
      fetchRoles(); // Refresh roles list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create role.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await api.patch(`/roles/${editingRole.id}`, { name: roleName, description: roleDescription });
      alert('Role updated successfully!');
      closeModals();
      fetchRoles(); // Refresh roles list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update role.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await api.delete(`/roles/${deletingRole.id}`);
      alert('Role deleted successfully!');
      closeModals();
      fetchRoles(); // Refresh roles list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete role.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionSelection = (permissionId: string, isChecked: boolean) => {
    setSelectedPermissions(prev =>
      isChecked
        ? [...prev, permissionId]
        : prev.filter(id => id !== permissionId)
    );
  };

  const handleAssignPermissions = async () => {
    if (!assigningPermissionsRole) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await api.post(`/roles/${assigningPermissionsRole.id}/permissions`, {
        permissionIds: selectedPermissions,
      });
      alert('Permissions assigned successfully!');
      closeModals();
      fetchRoles(); // Refresh roles to show updated permission counts
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to assign permissions.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group permissions by resource for the assign permissions modal
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const resourceName = permission.resource.charAt(0).toUpperCase() + permission.resource.slice(1);
    if (!acc[resourceName]) {
      acc[resourceName] = [];
    }
    acc[resourceName].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Role
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search roles by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="mx-auto h-20 w-20 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900">No roles found</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new role.</p>
          <div className="mt-6">
            <button
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center mx-auto transition duration-300 ease-in-out"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Role
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 ease-in-out border border-gray-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Shield className="mr-2 text-indigo-600" /> {role.name}
                  </h3>
                  {role.isSystem && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                      <Lock className="h-3 w-3 mr-1" /> System
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 min-h-[40px] line-clamp-2">
                  {role.description || 'No description provided.'}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Users className="h-4 w-4 mr-1 text-indigo-500" />
                  <span>{role.userCount} {role.userCount === 1 ? 'user' : 'users'}</span>
                  <ShieldCheck className="h-4 w-4 ml-4 mr-1 text-indigo-500" />
                  <span>{role.permissionCount} {role.permissionCount === 1 ? 'permission' : 'permissions'}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(role)}
                  disabled={role.isSystem}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${role.isSystem
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition duration-150 ease-in-out'
                    }`}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => openAssignPermissionsModal(role)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition duration-150 ease-in-out"
                >
                  <Key className="h-4 w-4 mr-1" /> Permissions
                </button>
                <button
                  onClick={() => openDeleteModal(role)}
                  disabled={role.isSystem}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${role.isSystem
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 transition duration-150 ease-in-out'
                    }`}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Create Role Modal */}
            {activeModal === 'create' && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Role</h2>
                <form onSubmit={handleCreateRole}>
                  <div className="mb-4">
                    <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      id="roleName"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      placeholder="e.g., Editor"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea
                      id="roleDescription"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="A short description of the role's responsibilities."
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !roleName.trim()}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Role'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Edit Role Modal */}
            {activeModal === 'edit' && editingRole && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Role</h2>
                <form onSubmit={handleUpdateRole}>
                  <div className="mb-4">
                    <label htmlFor="editRoleName" className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      id="editRoleName"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${editingRole.isSystem ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      required
                      disabled={editingRole.isSystem}
                      placeholder="e.g., Editor"
                    />
                    {editingRole.isSystem && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        System roles cannot have their name changed.
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="editRoleDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea
                      id="editRoleDescription"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="A short description of the role's responsibilities."
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !roleName.trim()}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Delete Confirmation Modal */}
            {activeModal === 'delete' && deletingRole && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete Role</h2>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete the role <span className="font-semibold text-indigo-600">"{deletingRole.name}"</span>?
                </p>
                {deletingRole.isSystem && (
                  <p className="bg-red-50 text-red-700 p-3 rounded-md flex items-center mb-4">
                    <Lock className="h-5 w-5 mr-2" />
                    This is a system role. Deleting it may impact core functionality and is not recommended.
                  </p>
                )}
                {deletingRole.userCount > 0 && (
                  <p className="bg-yellow-50 text-yellow-700 p-3 rounded-md flex items-center mb-4">
                    <Users className="h-5 w-5 mr-2" />
                    This role is assigned to <span className="font-semibold mx-1">{deletingRole.userCount}</span>{' '}
                    {deletingRole.userCount === 1 ? 'user' : 'users'}. Deleting it will remove the role from these users.
                  </p>
                )}
                <p className="text-gray-700 mb-6">This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRole}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete Role'}
                  </button>
                </div>
              </>
            )}

            {/* Assign Permissions Modal */}
            {activeModal === 'assignPermissions' && assigningPermissionsRole && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Assign Permissions to <span className="text-indigo-600">"{assigningPermissionsRole.name}"</span>
                </h2>
                <div className="max-h-96 overflow-y-auto pr-2 mb-6 -mr-2"> {/* Added -mr-2 to account for scrollbar */}
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No permissions available to assign.</p>
                  ) : (
                    Object.entries(groupedPermissions).map(([resource, perms]) => (
                      <div key={resource} className="mb-4 pb-2 border-b border-gray-200 last:border-b-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                          {perms.map((permission) => (
                            <label key={permission.id} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={(e) => handlePermissionSelection(permission.id, e.target.checked)}
                              />
                              <span className="ml-2 text-gray-700 text-sm">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignPermissions}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Permissions'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagementPage;
