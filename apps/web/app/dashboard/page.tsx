// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  Key,
  Activity,
  ArrowRight,
  Loader2,
  CheckCircle,
} from 'lucide-react';

// --- TypeScript Interfaces for API Data ---
// These interfaces assume the structure of data returned by your API endpoints.
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface Role {
  id: string;
  name: string;
  // Add other role properties as needed
}

interface Permission {
  id: string;
  name: string;
  // Add other permission properties as needed
}

// --- API Imports ---
// IMPORTANT: These functions are expected to be implemented in '@/lib/api'.
// For demonstration purposes, types are defined above.
// In a real application, ensure these functions handle fetching and error states.
import { fetchUsers, fetchRoles, fetchPermissions } from '@/lib/api';

// --- Component Definition ---

const DashboardHomePage: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalRoles, setTotalRoles] = useState<number | null>(null);
  const [totalPermissions, setTotalPermissions] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        // Use Promise.allSettled to allow all fetches to complete regardless of individual errors
        const [usersResult, rolesResult, permissionsResult] = await Promise.allSettled([
          fetchUsers(),
          fetchRoles(),
          fetchPermissions(),
        ]);

        // Update state based on fulfillment status
        if (usersResult.status === 'fulfilled') {
          setTotalUsers(usersResult.value.length);
        } else {
          console.error('Failed to fetch users:', usersResult.reason);
          setTotalUsers(0); // Show 0 on error
        }

        if (rolesResult.status === 'fulfilled') {
          setTotalRoles(rolesResult.value.length);
        } else {
          console.error('Failed to fetch roles:', rolesResult.reason);
          setTotalRoles(0); // Show 0 on error
        }

        if (permissionsResult.status === 'fulfilled') {
          setTotalPermissions(permissionsResult.value.length);
        } else {
          console.error('Failed to fetch permissions:', permissionsResult.reason);
          setTotalPermissions(0); // Show 0 on error
        }
      } catch (error) {
        // This catch block would only trigger if Promise.allSettled itself failed (highly unlikely)
        // or if an error occurred before the promises were even created.
        console.error('Unexpected error loading dashboard stats:', error);
        setTotalUsers(0);
        setTotalRoles(0);
        setTotalPermissions(0);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []); // Empty dependency array means this effect runs once on mount

  // Determine API base URL from environment variable or fallback to localhost
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  // Assuming Swagger docs are hosted at /api/docs relative to the application's base URL
  const SWAGGER_DOCS_URL = `${API_BASE_URL.replace('/api', '')}/api/docs`;

  // --- Helper Components for UI elements ---

  const StatCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col items-start space-y-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  );

  interface StatCardProps {
    icon: React.ElementType; // Lucide icon component
    title: string;
    value: number | null;
    colorClass: string; // Tailwind background color class for icon
  }

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out p-6 flex flex-col items-start space-y-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value === null ? <Loader2 className="animate-spin h-8 w-8 text-indigo-500" /> : value}
      </p>
    </div>
  );

  interface ActionCardProps {
    icon: React.ElementType; // Lucide icon component
    title: string;
    description: string;
    href?: string; // Optional href for linking
    disabled?: boolean; // Optional flag to disable the card
  }

  const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, href, disabled }) => {
    const cardContent = (
      <div className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-3
        ${!disabled ? 'hover:shadow-md hover:border-indigo-500 border border-transparent transition-all duration-200 ease-in-out group' : 'opacity-60 cursor-not-allowed'}
      `}>
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{description}</p>
        <div className="flex justify-between items-center text-sm font-medium">
          {!disabled ? (
            <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
              Learn more <ArrowRight className="inline-block h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">Coming Soon</span>
          )}
        </div>
      </div>
    );

    return disabled || !href ? (
      // If disabled or no href, render as a div
      cardContent
    ) : (
      // Otherwise, wrap in a Next.js Link
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
          Welcome to your administration panel. Get a quick glance at your system&apos;s status and actions.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">System Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingStats ? (
            // Show skeleton cards while loading
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            // Show actual stats cards
            <>
              <StatCard
                icon={Users}
                title="Total Users"
                value={totalUsers}
                colorClass="bg-blue-500"
              />
              <StatCard
                icon={Shield}
                title="Total Roles"
                value={totalRoles}
                colorClass="bg-green-500"
              />
              <StatCard
                icon={Key}
                title="Total Permissions"
                value={totalPermissions}
                colorClass="bg-purple-500"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            icon={Users}
            title="Manage Users"
            description="View, create, edit, and delete user accounts."
            href="/dashboard/users"
          />
          <ActionCard
            icon={Shield}
            title="Manage Roles"
            description="Define and assign roles with specific permissions."
            href="/dashboard/roles"
          />
          <ActionCard
            icon={Key}
            title="Manage Permissions"
            description="Configure granular access permissions for application resources."
            href="/dashboard/permissions"
          />
          <ActionCard
            icon={Activity}
            title="Activity Log"
            description="Review recent system activities and audit trails for security."
            disabled // This card is marked as coming soon
          />
        </div>
      </section>

      {/* System Information & Recent Activity Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information Panel */}
        <section className="mb-10 lg:mb-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">System Information</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flow-root">
              <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 dark:text-white">API Status</dt>
                  <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" /> Online
                    </span>
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 dark:text-white">API Endpoint</dt>
                  <dd className="text-gray-700 dark:text-gray-300 sm:col-span-2 break-all">
                    {API_BASE_URL}
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900 dark:text-white">Swagger Docs</dt>
                  <dd className="text-indigo-600 dark:text-indigo-400 sm:col-span-2">
                    <a
                      href={SWAGGER_DOCS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center"
                    >
                      View API Documentation
                      <ArrowRight className="inline-block h-4 w-4 ml-1" />
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Recent Activity Section (Placeholder) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[180px] flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 italic">
              No recent activity to display. (Coming soon)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHomePage;
