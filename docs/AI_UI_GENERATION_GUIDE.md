# AI-Powered UI Generation Guide with Gemini

**Goal**: Use Gemini AI API to generate React/Next.js UI components automatically

---

## 🤖 Method 1: Using Gemini AI API (Programmatic)

### Setup Gemini API

Your API Key: `AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU`

### Install Gemini SDK

```bash
cd /Users/thangdinh/working/management-user-ai/apps/web
npm install @google/generative-ai
```

### Create UI Generator Script

Create `scripts/generate-ui.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateComponent(prompt: string, componentName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fullPrompt = `
Generate a Next.js 14 App Router component with TypeScript and Tailwind CSS.

Requirements:
- Use 'use client' if needed
- Include proper TypeScript types
- Use Tailwind CSS for styling
- Modern, clean design
- Responsive layout
- Include necessary imports

Component Request: ${prompt}

Generate ONLY the component code, no explanations.
`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const code = response.text();

  // Save to file
  const filePath = path.join(process.cwd(), 'components', `${componentName}.tsx`);
  fs.writeFileSync(filePath, code);
  
  console.log(`✅ Generated: ${componentName}.tsx`);
  return code;
}

// Example usage
async function main() {
  await generateComponent(
    'Create a login form with email and password fields, a submit button, and a link to register',
    'LoginForm'
  );
}

main();
```

### Run the Generator

```bash
GEMINI_API_KEY=AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU npm run generate-ui
```

---

## 🎨 Method 2: Using v0.dev (Visual, Easier)

### Step 1: Access v0.dev
```
https://v0.dev
```

### Step 2: Describe Your UI

Example prompts for our app:

#### Login Page:
```
Create a modern login page with:
- Centered card layout
- Email and password inputs
- "Remember me" checkbox
- Login button
- "Forgot password?" link
- "Don't have an account? Register" link
- Use Next.js 14 App Router
- Tailwind CSS
- Dark mode support
```

#### Users Dashboard:
```
Create a users management dashboard with:
- Data table showing users (email, name, role, status)
- Search bar
- Filter by role dropdown
- "Add User" button
- Edit and delete actions per row
- Pagination
- Use Next.js 14 and Tailwind CSS
- shadcn/ui components
```

#### Roles Management:
```
Create a roles management interface with:
- List of roles as cards
- Each card shows: role name, description, number of users, permissions count
- "Create Role" button
- Edit/Delete buttons per card
- Modal for creating/editing roles
- Permission checkboxes organized by resource (users, roles, settings, etc.)
- Next.js 14, Tailwind CSS
```

### Step 3: Copy Generated Code

v0.dev will generate:
1. Component code
2. Dependencies needed
3. Installation instructions

---

## 🚀 Method 3: Cursor AI + Gemini (Best for Iteration)

### Use Cursor IDE:

1. Open project in Cursor
2. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
3. Type your request:

```
Create a login page component for Next.js 14:
- Use TypeScript
- Tailwind CSS styling
- Form validation with react-hook-form
- API call to http://localhost:3001/auth/login
- Store token in localStorage
- Redirect to /dashboard on success
- Show error messages
```

4. Cursor will generate the component
5. You can iterate with follow-up requests

---

## 📋 UI Components We Need

### Phase 1: Authentication (Week 5, Days 1-2)
- [ ] Login Page (`/login`)
- [ ] Register Page (`/register`)
- [ ] Forgot Password Page (`/forgot-password`)
- [ ] Password Reset Page (`/reset-password`)

### Phase 2: Dashboard Layout (Week 5, Days 3-4)
- [ ] Dashboard Layout with Sidebar
- [ ] Top Navigation Bar
- [ ] User Profile Dropdown
- [ ] Sidebar Menu Component

### Phase 3: User Management (Week 5, Day 5 - Week 6, Day 2)
- [ ] Users List/Table
- [ ] User Detail View
- [ ] Create User Modal/Form
- [ ] Edit User Modal/Form
- [ ] Delete Confirmation Modal
- [ ] Assign Roles Modal

### Phase 4: Role Management (Week 6, Days 3-4)
- [ ] Roles List
- [ ] Create Role Modal
- [ ] Edit Role Modal
- [ ] Permission Assignment Interface
- [ ] Role Detail View

### Phase 5: Additional Features (Week 6, Day 5)
- [ ] Audit Logs Viewer
- [ ] User Profile Settings
- [ ] Password Change Form
- [ ] Activity Timeline

---

## 🎯 Gemini Prompt Templates

### For Forms:
```
Create a React form component using TypeScript and Tailwind CSS:
- Form name: [Form Name]
- Fields: [field1: type, field2: type, ...]
- Validation: [validation rules]
- Submit handler that calls API endpoint: [endpoint]
- Loading state
- Error handling
- Success message
- Use react-hook-form and zod for validation
```

### For Tables:
```
Create a data table component for [resource name]:
- Columns: [column1, column2, ...]
- Features: search, filter, sort, pagination
- Actions: edit, delete, [custom actions]
- API endpoint: [GET endpoint]
- Use @tanstack/react-table
- Tailwind CSS styling
- Responsive design
```

### For Modals:
```
Create a modal component for [purpose]:
- Trigger button text: [button text]
- Modal title: [title]
- Content: [description of content]
- Actions: [Cancel, Confirm, etc.]
- Use Radix UI or Headless UI
- Tailwind CSS
- Animation/transitions
```

---

## 💡 Best Practices

### 1. Component Structure
```
components/
├── ui/              # Base UI components (Button, Input, Modal)
├── forms/           # Form components
├── layouts/         # Layout components
└── features/        # Feature-specific components
    ├── auth/
    ├── users/
    └── roles/
```

### 2. AI Generation Workflow
1. **Plan**: Write detailed component requirements
2. **Generate**: Use Gemini/v0.dev to generate initial code
3. **Refine**: Ask AI to adjust styling, add features
4. **Integrate**: Connect to your API
5. **Test**: Verify functionality

### 3. Prompt Engineering Tips
- Be specific about framework (Next.js 14 App Router)
- Mention TypeScript explicitly
- Specify Tailwind CSS for styling
- Include accessibility requirements
- Request error handling
- Ask for loading states
- Mention responsive design

---

## 🔥 Quick Start Commands

### Generate Login Page
```bash
# Using Gemini API
GEMINI_API_KEY=AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU \
node scripts/generate-ui.js --component=LoginForm --type=auth

# Or manually visit:
https://v0.dev
# Then paste your prompt
```

### Test Generated Component
```bash
cd apps/web
npm run dev
# Visit: http://localhost:3000
```

---

## 📚 Resources

- **Gemini AI**: https://ai.google.dev/
- **v0.dev**: https://v0.dev
- **Shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Next.js 14**: https://nextjs.org/docs

---

## 🎨 Example: Generate Login Page Now

### Prompt for Gemini:
```
Create a Next.js 14 login page component with:
- Server Actions or client-side API call
- Email and password fields with validation
- "Remember me" checkbox
- Submit button with loading state
- Error message display
- Link to registration page
- Modern, centered card layout
- Tailwind CSS styling
- Dark mode support
- TypeScript
- Call API: POST http://localhost:3001/auth/login
- Store JWT token in localStorage on success
- Redirect to /dashboard after login
```

### Prompt for v0.dev:
```
Modern login page for SaaS app:
- Clean, minimalist design
- Centered card on gradient background
- Email input with validation
- Password input with show/hide toggle
- "Remember me" checkbox
- Primary action button
- "Forgot password?" link
- "Sign up" link
- Loading states
- Error messages
- Next.js 14, TypeScript, Tailwind CSS
```

---

**Ready to generate your first component!** 🚀

Choose your method and start building! The AI will handle the heavy lifting.
