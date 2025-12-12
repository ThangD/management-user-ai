'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Key, Plus, Trash2, Shield, X, Search, ChevronDown, Loader2 } from 'lucide-react';
import clsx from 'clsx'; // For conditional class names
import { PermissionsSkeleton } from '@/components/loading-skeletons';
import { api } from '@/lib/api';

// --- API Interfaces ---
interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  roleCount?: number;
  rolePermissions?: Array<{
    role: {
      name: string;
    };
  }>;
  createdAt: string;
}

interface CreatePermissionPayload {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

type ResourceType = 'users' | 'roles' | 'permissions' | 'settings' | 'audit';
type ActionType = 'create' | 'read' | 'update' | 'delete' | 'manage';

interface CreatePermissionFormData {
  resource: ResourceType | '';
  action: ActionType | '';
  description: string;
}

const ALL_RESOURCES: ResourceType[] = ['users', 'roles', 'permissions', 'settings', 'audit'];
const ALL_ACTIONS: ActionType[] = ['create', 'read', 'update', 'delete', 'manage'];

const getActionBadgeClasses = (action: ActionType) => {
  switch (action) {
    case 'create':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20';
    case 'read':
      return 'bg-sky-100 text-sky-800 ring-sky-600/20';
    case 'update':
      return 'bg-amber-100 text-amber-800 ring-amber-600/20';
    case 'delete':
      return 'bg-rose-100 text-rose-800 ring-rose-600/20';
    case 'manage':
      return 'bg-purple-100 text-purple-800 ring-purple-600/20';
    default:
      return 'bg-gray-100 text-gray-800 ring-gray-600/20';
  }
};

export default function PermissionsManagementPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePermissionFormData>({
    resource: '',
    action: '',
    description: '',
  });
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set(ALL_RESOURCES)); // All expanded by default

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/permissions');
      // Map the data to include roleCount from rolePermissions
      const permissionsData = (response.data || []).map((p: any) => ({
        ...p,
        roleCount: p.rolePermissions?.length || 0,
      }));
      setPermissions(permissionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch permissions');
      console.error('Failed to fetch permissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const filteredPermissions = useMemo(() => {
    if (!searchTerm) {
      return permissions;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(lowercasedSearchTerm) ||
        permission.description?.toLowerCase().includes(lowercasedSearchTerm) ||
        permission.resource.toLowerCase().includes(lowercasedSearchTerm) ||
        permission.action.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [permissions, searchTerm]);

  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce(
      (acc, permission) => {
        const resource = permission.resource;
        if (!acc[resource]) {
          acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [filteredPermissions]);

  const sortedResources = useMemo(() => {
    return Object.keys(groupedPermissions).sort((a, b) => {
      // Sort by ALL_RESOURCES order first, then alphabetically
      const indexA = ALL_RESOURCES.indexOf(a as ResourceType);
      const indexB = ALL_RESOURCES.indexOf(b as ResourceType);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      return a.localeCompare(b);
    });
  }, [groupedPermissions]);

  // Pagination
  const totalItems = filteredPermissions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedPermissions = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredPermissions.slice(startIndex, startIndex + pageSize);
  }, [filteredPermissions, page, pageSize]);

  const paginatedGroupedPermissions = useMemo(() => {
    return paginatedPermissions.reduce(
      (acc, permission) => {
        const resource = permission.resource;
        if (!acc[resource]) {
          acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [paginatedPermissions]);

  const paginatedSortedResources = useMemo(() => {
    return Object.keys(paginatedGroupedPermissions).sort((a, b) => {
      const indexA = ALL_RESOURCES.indexOf(a as ResourceType);
      const indexB = ALL_RESOURCES.indexOf(b as ResourceType);
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      return a.localeCompare(b);
    });
  }, [paginatedGroupedPermissions]);

  const handleCreatePermissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatedPermissionName = useMemo(() => {
    if (formData.resource && formData.action) {
      return `${formData.resource}.${formData.action}`;
    }
    return '';
  }, [formData.resource, formData.action]);

  const handleCreatePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreate(true);
    setError(null);

    if (!formData.resource || !formData.action) {
      setError('Resource and Action are required.');
      setSubmittingCreate(false);
      return;
    }

    const payload: CreatePermissionPayload = {
      name: generatedPermissionName,
      resource: formData.resource,
      action: formData.action,
      description: formData.description || undefined,
    };

    try {
      await api.post('/permissions', payload);
      setIsCreateModalOpen(false);
      setFormData({ resource: '', action: '', description: '' });
      await fetchPermissions(); // Re-fetch all permissions
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create permission.');
      console.error('Failed to create permission:', err);
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleDeletePermission = async (id: string, name: string, roleCount: number) => {
    if (roleCount > 0) {
      const confirmDelete = window.confirm(
        `This permission ("${name}") is currently used by ${roleCount} role(s). Deleting it might break functionality for those roles. Are you sure you want to proceed?`
      );
      if (!confirmDelete) {
        return;
      }
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete the permission "${name}"?`);
      if (!confirmDelete) {
        return;
      }
    }

    setLoading(true); // Indicate overall loading state
    try {
      await api.delete(`/permissions/${id}`);
      await fetchPermissions(); // Re-fetch all permissions
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete permission.');
      console.error('Failed to delete permission:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleResourceExpansion = (resource: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resource)) {
        newSet.delete(resource);
      } else {
        newSet.add(resource);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            Permissions Management
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Permission
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search permissions
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search permissions by name, description, resource or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {loading && (
          <PermissionsSkeleton />
        )}

        {!loading && paginatedSortedResources.length === 0 && (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-gray-200">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No permissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new permission.'}
            </p>
          </div>
        )}

        {!loading && paginatedSortedResources.length > 0 && (
          <div className="space-y-6">
            {paginatedSortedResources.map((resource) => (
              <div key={resource} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                  onClick={() => toggleResourceExpansion(resource)}
                  className="flex w-full items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg focus:outline-none"
                  aria-expanded={expandedResources.has(resource)}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-indigo-500" />
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">{resource}</h2>
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                      {paginatedGroupedPermissions[resource].length} permissions
                    </span>
                  </div>
                  <ChevronDown
                    className={clsx(
                      'h-6 w-6 text-gray-500 transition-transform duration-200',
                      expandedResources.has(resource) ? 'rotate-180' : 'rotate-0'
                    )}
                  />
                </button>
                {expandedResources.has(resource) && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginatedGroupedPermissions[resource].map((permission) => (
                        <div
                          key={permission.id}
                          className="relative bg-white border border-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Key className="h-5 w-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900 truncate">{permission.name}</h3>
                          </div>
                          <span
                            className={clsx(
                              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                              getActionBadgeClasses(permission.action as ActionType)
                            )}
                          >
                            {permission.action}
                          </span>
                          {permission.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{permission.description}</p>
                          )}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                            <span>
                              Used by{' '}
                              <strong className="font-medium text-gray-800">
                                {permission.roleCount || 0} role{permission.roleCount !== 1 ? 's' : ''}
                              </strong>
                            </span>
                            <div className="relative group/roles">
                              {(permission.roleCount || 0) > 0 && (
                                <span className="underline decoration-dashed decoration-gray-400 cursor-help">
                                  See roles
                                </span>
                              )}
                              {(permission.roleCount || 0) > 0 && permission.rolePermissions && (
                                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/roles:block w-auto min-w-[150px] max-w-xs rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 p-2 text-white text-xs">
                                  <h4 className="font-semibold mb-1">Roles with this permission:</h4>
                                  <ul className="list-disc pl-4">
                                    {permission.rolePermissions.map((rp, idx) => (
                                      <li key={idx}>{rp.role.name}</li>
                                    ))}
                                  </ul>
                                  <div className="absolute bottom-[-5px] right-3 w-3 h-3 bg-gray-800 rotate-45"></div>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeletePermission(permission.id, permission.name, permission.roleCount || 0)}
                              className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              title="Delete permission"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-6 px-6 py-4 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </select>
              <span>
                of {totalItems} permissions
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg transition ${
                        page === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Permission Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Permission</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreatePermissionSubmit} className="space-y-4">
              <div>
                <label htmlFor="resource" className="block text-sm font-medium text-gray-700">
                  Resource <span className="text-red-500">*</span>
                </label>
                <select
                  id="resource"
                  name="resource"
                  value={formData.resource}
                  onChange={handleCreatePermissionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a resource</option>
                  {ALL_RESOURCES.map((res) => (
                    <option key={res} value={res}>
                      {res.charAt(0).toUpperCase() + res.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                  Action <span className="text-red-500">*</span>
                </label>
                <select
                  id="action"
                  name="action"
                  value={formData.action}
                  onChange={handleCreatePermissionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select an action</option>
                  {ALL_ACTIONS.map((act) => (
                    <option key={act} value={act}>
                      {act.charAt(0).toUpperCase() + act.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Permission Name (Auto-generated)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={generatedPermissionName}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm sm:text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleCreatePermissionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., Allows administrators to create new user accounts."
                ></textarea>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  disabled={submittingCreate}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submittingCreate || !formData.resource || !formData.action}
                >
                  {submittingCreate ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Plus className="mr-2 h-5 w-5" />
                  )}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
