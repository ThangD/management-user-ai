'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, Shield, Key, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, rolesRes, permissionsRes] = await Promise.all([
          api.get('/users'),
          api.get('/roles'),
          api.get('/permissions'),
        ]);

        setStats({
          users: usersRes.data.meta?.total || usersRes.data.data?.length || 0,
          roles: rolesRes.data.length || 0,
          permissions: permissionsRes.data.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Roles',
      value: stats.roles,
      icon: Shield,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      name: 'Permissions',
      value: stats.permissions,
      icon: Key,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your user management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/users"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
          >
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Manage Users
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                View all users
              </p>
            </div>
          </a>

          <a
            href="/dashboard/roles"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition"
          >
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Manage Roles
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Configure roles
              </p>
            </div>
          </a>

          <a
            href="/dashboard/permissions"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
          >
            <Key className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Permissions
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                View permissions
              </p>
            </div>
          </a>

          <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Activity className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Activity
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Information
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">API Status</span>
            <span className="flex items-center text-green-600 dark:text-green-400">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">API Endpoint</span>
            <span className="text-gray-900 dark:text-white">http://localhost:3001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Documentation</span>
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Swagger Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
