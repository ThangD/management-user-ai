const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU';

async function generateComponent(prompt, outputPath) {
  console.log('🤖 Generating component with Gemini AI...');
  console.log('📝 Prompt:', prompt.substring(0, 100) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let code = response.text();

    // Clean up the response - remove markdown code blocks if present
    code = code.replace(/```typescript\n?/g, '');
    code = code.replace(/```tsx\n?/g, '');
    code = code.replace(/```jsx\n?/g, '');
    code = code.replace(/```javascript\n?/g, '');
    code = code.replace(/```\n?/g, '');

    // Ensure the code starts with proper imports
    if (!code.includes("'use client'") && prompt.includes('client component')) {
      code = "'use client';\n\n" + code;
    }

    // Save to file
    const fullPath = path.join('/Users/thangdinh/working/management-user-ai/apps/web', outputPath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, code);
    
    console.log('✅ Generated:', outputPath);
    console.log('📦 Size:', code.length, 'characters');
    return code;
  } catch (error) {
    console.error('❌ Error generating component:', error.message);
    throw error;
  }
}

async function generateLoginPage() {
  const prompt = `
Generate a Next.js 14 client component for a Login page with TypeScript and Tailwind CSS.

IMPORTANT REQUIREMENTS:
- Must be a 'use client' component
- Use TypeScript with proper interfaces
- Use Tailwind CSS for all styling
- Use lucide-react icons: Mail, Lock, Eye, EyeOff, LogIn
- Import from '@/lib/api' and '@/lib/auth' for API calls

API INTEGRATION:
- Use: import api from '@/lib/api';
- Use: import { setToken } from '@/lib/auth';
- POST /auth/login endpoint with { email, password }
- Response: { accessToken, user }
- After successful login: setToken(accessToken) then router.push('/dashboard')

FEATURES TO IMPLEMENT:
1. Centered login card on full-screen background
2. Email input field with Mail icon
3. Password input field with Lock icon
4. Show/hide password toggle with Eye/EyeOff icons
5. "Remember me" checkbox
6. Login button with loading state
7. Form validation (email format, password length)
8. Error messages display
9. Link to "Forgot password?" (just UI, no functionality)
10. Professional, modern design

VALIDATION:
- Email must be valid format
- Password must be at least 8 characters
- Show inline error messages
- Disable submit while loading

STYLING:
- Modern gradient background
- White card with shadow
- Indigo primary color
- Smooth transitions and animations
- Responsive (mobile-friendly)
- Dark mode support
- Professional login form UI

UI LAYOUT:
- Centered vertically and horizontally
- Card with logo/title at top
- Form fields stacked
- Button full width
- Clean, spacious design

ERROR HANDLING:
- Display error message from API
- Show field validation errors
- Handle network errors
- Loading spinner on button during submit

GENERATE ONLY THE COMPONENT CODE for app/login/page.tsx. No explanations.
`;

  await generateComponent(prompt, 'app/login/page.tsx');
}

async function generateDashboardPage() {
  const prompt = `
Generate a Next.js 14 client component for a Dashboard Home page with TypeScript and Tailwind CSS.

IMPORTANT REQUIREMENTS:
- Must be a 'use client' component (but wrapped by dashboard layout)
- Use TypeScript with proper interfaces
- Use Tailwind CSS for all styling
- Use lucide-react icons: Users, Shield, Key, Activity, TrendingUp, Clock
- Import from '@/lib/api' for API calls

API ENDPOINTS TO USE:
- GET /users - fetch users list to count
- GET /roles - fetch roles list to count
- GET /permissions - fetch permissions list to count

FEATURES TO IMPLEMENT:
1. Page header with title and description
2. Stats cards grid showing:
   - Total Users (with Users icon, blue theme)
   - Total Roles (with Shield icon, green theme)
   - Total Permissions (with Key icon, purple theme)
3. Quick Actions section with cards linking to:
   - Manage Users (/dashboard/users)
   - Manage Roles (/dashboard/roles)
   - Manage Permissions (/dashboard/permissions)
   - Activity Log (coming soon, disabled)
4. System Information panel showing:
   - API Status (online indicator)
   - API Endpoint URL
   - Link to Swagger documentation
5. Recent Activity section (placeholder for future)

STATS CARDS DESIGN:
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card has colored icon background
- Shows metric name and value
- Hover effect
- Loading skeleton while fetching

QUICK ACTIONS:
- 4 cards in grid
- Icon + title + description
- Clickable links
- Hover effects
- Different colors per action

SYSTEM INFO:
- Clean table/list layout
- Status indicators (green dot for online)
- Clickable links

STYLING:
- Use indigo primary color
- White cards with shadows
- Responsive grid layouts
- Loading states with spinner
- Empty states if needed
- Dark mode support
- Modern, professional design

ERROR HANDLING:
- Show 0 for stats if API fails
- Console.error for debugging
- Graceful fallbacks

GENERATE ONLY THE COMPONENT CODE for app/dashboard/page.tsx. No explanations.
`;

  await generateComponent(prompt, 'app/dashboard/page.tsx');
}

async function generateUsersPage() {
  const prompt = `
Generate a Next.js 14 client component for a Users Management page with TypeScript and Tailwind CSS.

IMPORTANT REQUIREMENTS:
- Must be a 'use client' component
- Use TypeScript with proper interfaces
- Use Tailwind CSS for all styling
- Use lucide-react icons: Plus, Search, Edit, Trash2, Shield, X, User
- Import from '@/lib/api' for API calls

API ENDPOINTS TO USE:
- GET /users - fetch all users
- POST /users - create user { email, password, firstName, lastName, phone }
- PATCH /users/:id - update user { email, firstName, lastName, phone, status }
- DELETE /users/:id - delete user
- POST /users/:id/roles - assign roles { roleIds: string[] }
- GET /roles - fetch all roles for assignment

USER INTERFACE:
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: string;
  userRoles: Array<{
    role: {
      name: string;
    };
  }>;
  createdAt: string;
}

FEATURES TO IMPLEMENT:
1. Page header with "Add User" button
2. Search bar to filter users by name/email
3. Users table showing:
   - User avatar (initials circle)
   - Name and email
   - Role badges
   - Status badge (active/inactive/suspended)
   - Created date
   - Action buttons (Assign Roles, Edit, Delete)
4. Create User Modal with fields:
   - Email, Password, First Name, Last Name, Phone
5. Edit User Modal with fields:
   - Email, First Name, Last Name, Phone, Status dropdown
6. Delete Confirmation Modal
7. Assign Roles Modal with checkboxes
8. Empty state if no users
9. Loading state while fetching

TABLE DESIGN:
- Responsive table with hover effects
- Avatar with user initials
- Badge for each role (indigo)
- Status badge with colors (green=active, red=inactive)
- Action buttons in right column
- Mobile-responsive (stack on small screens)

MODALS:
- Overlay with backdrop
- Close button (X icon)
- Cancel and Submit buttons
- Form validation
- Loading state on submit

VALIDATION:
- Email format check
- Password min 8 characters
- Required fields marked
- Show error from API

FEATURES:
- Real-time search filtering
- Multiple role assignment
- Status change (active/inactive/suspended)
- Confirmation before delete
- Show role count per user

STYLING:
- Indigo primary color
- Table with borders and hover
- Modal with shadow
- Responsive layout
- Loading spinner
- Dark mode support

ERROR HANDLING:
- Alert for errors (simple for now)
- Loading states
- Empty states

GENERATE ONLY THE COMPONENT CODE for app/dashboard/users/page.tsx. No explanations.
`;

  await generateComponent(prompt, 'app/dashboard/users/page.tsx');
}

// Main execution
async function main() {
  console.log('🚀 Regenerating ALL UI with Gemini AI...\n');
  
  try {
    console.log('1️⃣ Generating Login Page...');
    await generateLoginPage();
    console.log('');
    
    console.log('2️⃣ Generating Dashboard Home Page...');
    await generateDashboardPage();
    console.log('');
    
    console.log('3️⃣ Generating Users Management Page...');
    await generateUsersPage();
    console.log('');
    
    console.log('✅ All components regenerated successfully!');
    console.log('\n🎯 Summary:');
    console.log('✅ Login page - regenerated with Gemini AI');
    console.log('✅ Dashboard home - regenerated with Gemini AI');
    console.log('✅ Users management - regenerated with Gemini AI');
    console.log('✅ Roles management - already AI-generated');
    console.log('✅ Permissions management - already AI-generated');
    console.log('\n🎉 100% of your UI is now AI-generated by Gemini!');
    console.log('\n🌐 Test at: http://localhost:3000');
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
