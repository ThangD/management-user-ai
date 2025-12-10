import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create default roles
  console.log('Creating roles...');
  
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Full system access',
      isSystemRole: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Manage users and settings',
      isSystemRole: true,
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'View and limited edit permissions',
      isSystemRole: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Standard user access',
      isSystemRole: true,
    },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: 'Guest' },
    update: {},
    create: {
      name: 'Guest',
      description: 'Read-only access',
      isSystemRole: true,
    },
  });

  console.log('✅ Roles created');

  // Create permissions
  console.log('Creating permissions...');
  
  const permissions = [
    // User permissions
    { name: 'users.create', description: 'Create users', resource: 'users', action: 'create' },
    { name: 'users.read', description: 'View users', resource: 'users', action: 'read' },
    { name: 'users.update', description: 'Update users', resource: 'users', action: 'update' },
    { name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete' },
    
    // Role permissions
    { name: 'roles.create', description: 'Create roles', resource: 'roles', action: 'create' },
    { name: 'roles.read', description: 'View roles', resource: 'roles', action: 'read' },
    { name: 'roles.update', description: 'Update roles', resource: 'roles', action: 'update' },
    { name: 'roles.delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
    { name: 'roles.manage', description: 'Manage roles', resource: 'roles', action: 'manage' },
    
    // Permission permissions
    { name: 'permissions.read', description: 'View permissions', resource: 'permissions', action: 'read' },
    { name: 'permissions.manage', description: 'Manage permissions', resource: 'permissions', action: 'manage' },
    
    // Settings permissions
    { name: 'settings.read', description: 'View settings', resource: 'settings', action: 'read' },
    { name: 'settings.update', description: 'Update settings', resource: 'settings', action: 'update' },
    
    // Audit log permissions
    { name: 'audit.read', description: 'View audit logs', resource: 'audit', action: 'read' },
  ];

  const createdPermissions: any[] = [];
  for (const perm of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions.push(permission);
  }

  console.log('✅ Permissions created');

  // Assign all permissions to Super Admin role
  console.log('Assigning permissions to roles...');
  
  for (const permission of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign limited permissions to Admin role
  const adminPermissions = createdPermissions.filter(p => 
    p.name.startsWith('users.') || 
    p.name === 'roles.read' || 
    p.name === 'audit.read'
  );
  
  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign read-only permissions to Manager role
  const managerPermissions = createdPermissions.filter(p => 
    p.action === 'read'
  );
  
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Permissions assigned to roles');

  // Create default admin user
  console.log('Creating admin user...');
  
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      status: 'active',
      emailVerified: true,
    },
  });

  // Assign Super Admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Admin user created');

  // Create a demo regular user
  const demoPasswordHash = await bcrypt.hash('Demo@123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      firstName: 'Demo',
      lastName: 'User',
      status: 'active',
      emailVerified: true,
    },
  });

  // Assign User role to demo user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: demoUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      roleId: userRole.id,
    },
  });

  console.log('✅ Demo user created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: Admin@123');
  console.log('\n📧 Demo user credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: Demo@123');
  console.log('\n✨ You can now start the API and login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
