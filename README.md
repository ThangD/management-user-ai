# 🚀 User Management System

A modern, full-stack user management system with role-based access control (RBAC), built with NestJS and Next.js.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ✨ Features

- 🔐 **Authentication** - JWT-based secure login/logout
- 👥 **User Management** - Full CRUD operations for users
- 🎭 **Role Management** - Create and manage user roles
- 🔑 **Permission Management** - Granular permission control
- 📊 **Dashboard** - Analytics and overview
- ⚡ **Loading States** - Professional skeleton loaders
- 🔔 **Toast Notifications** - Real-time user feedback
- 📱 **Responsive Design** - Mobile-friendly interface
- 🤖 **AI-Powered UI** - Gemini AI integration for UI generation

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Lucide Icons** - Beautiful icons
- **Sonner** - Toast notifications

### Deployment
- **Railway** - Backend hosting + PostgreSQL
- **Vercel** - Frontend hosting
- **Docker** - Containerization ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ThangD/management-user-ai.git
cd management-user-ai

# Install dependencies
npm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start PostgreSQL (using Docker)
docker-compose up -d postgres

# Run database migrations
cd apps/api
npm run migration:run

# Seed database
npm run seed

# Start the backend
npm run start:dev

# In another terminal, start the frontend
cd apps/web
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api (Swagger)

### Default Credentials

```
Email: admin@example.com
Password: Admin@123
```

## 📖 Documentation

- **[START_HERE.md](START_HERE.md)** - Quick overview and next steps
- **[DEPLOY_NOW.md](DEPLOY_NOW.md)** - Step-by-step deployment guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment options
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Manual testing instructions
- **[MANAGEMENT_USERS_PLAN.md](MANAGEMENT_USERS_PLAN.md)** - Project planning document

## 🎯 Project Structure

```
management-user-ai/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── users/         # User management
│   │   │   ├── roles/         # Role management
│   │   │   ├── permissions/   # Permission management
│   │   │   └── database/      # Database config & seeds
│   │   └── Dockerfile         # Backend container
│   │
│   └── web/                   # Next.js Frontend
│       ├── app/
│       │   ├── dashboard/     # Dashboard pages
│       │   ├── login/         # Login page
│       │   └── page.tsx       # Landing page
│       ├── components/        # React components
│       ├── lib/              # Utilities
│       └── Dockerfile        # Frontend container
│
├── docs/                     # Additional documentation
├── scripts/                  # Utility scripts
└── docker-compose.yml        # Local development setup
```

## 🚢 Deployment

Deploy to production in ~35 minutes using free tiers:

### Option 1: Railway + Vercel (Recommended)

**Backend (Railway):**
1. Sign up at https://railway.app
2. Create PostgreSQL database
3. Deploy API service
4. Configure environment variables

**Frontend (Vercel):**
1. Sign up at https://vercel.com
2. Import GitHub repository
3. Configure environment variables
4. Deploy

**Detailed Guide:** See [DEPLOY_NOW.md](DEPLOY_NOW.md)

### Option 2: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 🧪 Testing

### Manual Testing
```bash
# Follow the testing guide
cat TESTING_GUIDE.md
```

### Run Tests (Coming Soon)
```bash
# Backend tests
cd apps/api
npm test

# Frontend tests
cd apps/web
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/roles` - Assign roles to user

### Roles
- `GET /roles` - List all roles
- `GET /roles/:id` - Get role by ID
- `POST /roles` - Create new role
- `PATCH /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role

### Permissions
- `GET /permissions` - List all permissions
- `GET /permissions/:id` - Get permission by ID
- `POST /permissions` - Create new permission
- `PATCH /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission

## 🌟 Key Features Explained

### Role-Based Access Control (RBAC)
The system implements a complete RBAC system:
- **Users** can have multiple **Roles**
- **Roles** can have multiple **Permissions**
- Fine-grained access control for different actions

### AI-Powered UI Generation
Uses Google's Gemini AI to generate UI components:
- Automatic page generation from prompts
- Consistent design patterns
- Rapid prototyping

### Modern Architecture
- **Backend:** Clean architecture with separate modules
- **Frontend:** React Server Components with App Router
- **Database:** TypeORM with migrations and seeds
- **Type Safety:** Full TypeScript coverage

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP)
- **Railway:** $5 credit/month (enough for small apps)
- **Vercel:** Free unlimited deployments
- **PostgreSQL:** Included in Railway
- **SSL Certificates:** Free automatic
- **Total: $0/month** 🎉

### Production Scale
- **Railway:** $5-20/month
- **Vercel:** $20/month (Pro)
- **Custom Domain:** $10-15/year

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Railway](https://railway.app/) - Deployment platform
- [Vercel](https://vercel.com/) - Frontend hosting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library

## 📧 Contact

**Project Maintainer:** ThangD

**Project Link:** [https://github.com/ThangD/management-user-ai](https://github.com/ThangD/management-user-ai)

## 🗺️ Roadmap

- [ ] Deploy to production
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Activity logs
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] API rate limiting

## 📈 Project Stats

- **Lines of Code:** 5,000+
- **Files:** 50+
- **Features:** 15+
- **API Endpoints:** 20+
- **Build Time:** 1 day
- **Deployment Time:** 35 minutes

---

**Built with ❤️ by ThangD**

**⭐ Star this repository if you find it helpful!**
