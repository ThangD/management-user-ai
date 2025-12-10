# Day 1: Implementation Kickoff Checklist

**Date**: December 10, 2024
**Status**: 🚀 Ready to Start

## ✅ What to Do Now (Step by Step)

### Step 1: Make Tech Stack Decisions (30 minutes)

**Backend Framework:**
- [x] **NestJS** (Recommended - TypeScript, built-in features)
- [ ] Node.js/Express (Simpler, more manual)
- [ ] Django (Python, batteries included)

**Frontend Framework:**
- [x] **Next.js 14** (Recommended - React + SSR + TypeScript)
- [ ] React + Vite (Simpler SPA)
- [ ] Vue.js/Nuxt

**Database:**
- [x] **PostgreSQL** (Recommended - RBAC needs relations)
- [ ] MongoDB (Only if you prefer NoSQL)

**Mobile (Later):**
- [x] React Native (JavaScript, same as web)
- [ ] Flutter (Dart, faster performance)

**My Recommendation:**
```
✅ Backend: NestJS (TypeScript)
✅ Frontend: Next.js 14 (TypeScript + Tailwind)
✅ Database: PostgreSQL
✅ Mobile: React Native (Week 9+)
```

---

### Step 2: Set Up AI Tools (15 minutes)

1. **Get Gemini API Key (Free)**
   ```bash
   # Visit: https://makersuite.google.com/app/apikey
   # Click "Get API Key"
   # Key: AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU
   ```

2. **Sign up for v0.dev (Free)**
   ```bash
   # Visit: https://v0.dev
   # Sign in with GitHub
   # Try generating a component
   ```

3. **Install GitHub Copilot (Optional - $10/month)**
   ```bash
   # In VS Code: Install "GitHub Copilot" extension
   # Sign in with GitHub
   ```

---

### Step 3: Initialize Project Structure (30 minutes)

**Option A: Monorepo (Recommended)**
```bash
cd /Users/thangdinh/working/management-user-ai

# Create monorepo structure
mkdir -p apps/api apps/web apps/mobile
mkdir -p packages/shared packages/types
mkdir -p docs scripts

# Initialize package.json at root
npm init -y

# Install Turborepo or pnpm workspaces
npm install -D turbo
# OR
npm install -g pnpm
```

**Option B: Separate Repos**
```bash
cd /Users/thangdinh/working

# Create separate projects
npx @nestjs/cli new management-user-api
npx create-next-app@latest management-user-web
```

---

### Step 4: Set Up Backend API (45 minutes)

```bash
# Navigate to your workspace
cd /Users/thangdinh/working/management-user-ai

# Create NestJS app
npx @nestjs/cli new apps/api
cd apps/api

# Install core dependencies
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm install bcrypt class-validator class-transformer
npm install @prisma/client
npm install -D prisma @types/bcrypt @types/passport-jwt

# Initialize Prisma
npx prisma init

# You should now have:
# - apps/api/src/
# - apps/api/prisma/schema.prisma
# - apps/api/.env
```

**Configure .env:**
```bash
cat > apps/api/.env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/management_users_dev"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=3001
EOF
```

---

### Step 5: Set Up Database (20 minutes)

**Start PostgreSQL with Docker:**
```bash
# Create docker-compose.yml at root
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: management-users-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: management_users_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: management-users-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Start database
docker-compose up -d

# Verify it's running
docker ps
```

---

### Step 6: Create Database Schema (30 minutes)

**Update Prisma Schema:**
```bash
# Edit apps/api/prisma/schema.prisma
cat > apps/api/prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  firstName     String   @map("first_name")
  lastName      String   @map("last_name")
  phone         String?
  avatarUrl     String?  @map("avatar_url")
  status        String   @default("active") // active, inactive, suspended, pending
  emailVerified Boolean  @default(false) @map("email_verified")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  lastLoginAt   DateTime? @map("last_login_at")

  userRoles    UserRole[]
  auditLogs    AuditLog[]

  @@map("users")
}

model Role {
  id           String   @id @default(uuid())
  name         String   @unique
  description  String?
  isSystemRole Boolean  @default(false) @map("is_system_role")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  resource    String
  action      String
  createdAt   DateTime @default(now()) @map("created_at")

  rolePermissions RolePermission[]

  @@map("permissions")
}

model UserRole {
  userId     String   @map("user_id")
  roleId     String   @map("role_id")
  assignedAt DateTime @default(now()) @map("assigned_at")
  assignedBy String?  @map("assigned_by")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  roleId       String @map("role_id")
  permissionId String @map("permission_id")

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  action    String
  resource  String
  details   Json?
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
}
EOF

# Generate Prisma Client
cd apps/api
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# You should see: "Your database is now in sync with your schema"
```

---

### Step 7: Create Seed Data (15 minutes)

```bash
# Create seed script
cat > apps/api/prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default roles
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

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Standard user access',
      isSystemRole: true,
    },
  });

  console.log('✅ Roles created');

  // Create permissions
  const permissions = [
    { name: 'users.create', description: 'Create users', resource: 'users', action: 'create' },
    { name: 'users.read', description: 'View users', resource: 'users', action: 'read' },
    { name: 'users.update', description: 'Update users', resource: 'users', action: 'update' },
    { name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete' },
    { name: 'roles.manage', description: 'Manage roles', resource: 'roles', action: 'manage' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  console.log('✅ Permissions created');

  // Create default admin user
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
  console.log('\n📧 Email: admin@example.com');
  console.log('🔑 Password: Admin@123');
  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Update package.json to include seed script
npm pkg set prisma.seed="ts-node prisma/seed.ts"

# Install ts-node
npm install -D ts-node

# Run seed
npx prisma db seed
```

---

### Step 8: Set Up Frontend Web (30 minutes)

```bash
# Go back to root
cd /Users/thangdinh/working/management-user-ai

# Create Next.js app
npx create-next-app@latest apps/web --typescript --tailwind --app --no-src-dir

# Navigate to web app
cd apps/web

# Install dependencies
npm install axios zustand react-hook-form @tanstack/react-table
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react

# Install shadcn/ui (optional but recommended)
npx shadcn-ui@latest init

# You should now have:
# - apps/web/app/
# - apps/web/tailwind.config.js
# - apps/web/package.json
```

**Configure API URL:**
```bash
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

---

## 🎯 Today's Goals (Remaining Time)

### Goal 1: Get Backend API Running (1 hour)

1. **Create Auth Module**
```bash
cd apps/api
nest generate module auth
nest generate service auth
nest generate controller auth
```

2. **Create Users Module**
```bash
nest generate module users
nest generate service users
nest generate controller users
```

3. **Start the API**
```bash
npm run start:dev

# Should see: "Application is running on: http://localhost:3001"
```

4. **Access Swagger Docs**
```bash
# Open browser: http://localhost:3001/api-docs
```

### Goal 2: Create First API Endpoint (30 minutes)

Test that everything works by creating a simple health check endpoint.

---

## 📝 End of Day 1 Checklist

- [ ] Tech stack decided
- [ ] AI tools set up (Gemini API key, v0.dev account)
- [ ] Project structure created
- [ ] Backend API initialized (NestJS)
- [ ] Database running (PostgreSQL + Redis in Docker)
- [ ] Prisma schema created
- [ ] Database migrated
- [ ] Seed data loaded
- [ ] Frontend initialized (Next.js)
- [ ] API running on localhost:3001
- [ ] Swagger docs accessible
- [ ] Committed to Git

---

## 🚀 Tomorrow (Day 2)

- Implement authentication (login/register)
- Create JWT strategy
- Build login form with v0.dev
- Test end-to-end authentication flow

---

## 🆘 If You Get Stuck

**Database won't start?**
```bash
docker-compose down
docker-compose up -d
```

**Port already in use?**
```bash
# Find process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Prisma errors?**
```bash
npx prisma generate
npx prisma migrate reset
npx prisma db seed
```

**Need help?**
- Check the TROUBLESHOOTING section in MANAGEMENT_USERS_PLAN.md
- Search Stack Overflow
- Ask ChatGPT/Claude

---

**Let's start! 🚀**
