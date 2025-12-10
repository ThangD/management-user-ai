const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyCBO_JLbIYNkPrwNHApWg3p3XVQm5Fh7vU';

async function generateUsersPage() {
  const prompt = `
Generate a Next.js 14 client component for a Users Management page with TypeScript and Tailwind CSS.

CRITICAL: Use the REAL API import, NOT mock data!

REQUIRED IMPORTS:
import api from '@/lib/api';  // THIS IS REAL, NOT MOCK!

API ENDPOINTS (REAL, NOT MOCK):
- GET /users - returns { data: User[] } or User[]
- POST /users - create user
- PATCH /users/:id - update user
- DELETE /users/:id - delete user
- POST /users/:id/roles - assign roles
- GET /roles - fetch roles

USER INTERFACE:
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: string;
  userRoles: Array<{
    role: { name: string; };
  }>;
  createdAt: string;
}

FEATURES:
1. Table with user data (avatar, name, email, roles, status, actions)
2. Search bar (filter by name/email)
3. Add User button → Create Modal
4. Edit icon → Edit Modal
5. Delete icon → Delete Confirmation
6. Shield icon → Assign Roles Modal
7. Loading state, empty state

MODALS:
- Create: email, password, firstName, lastName, phone
- Edit: email, firstName, lastName, phone, status
- Delete: confirmation message
- Assign Roles: checkboxes for each role

IMPORTANT:
- NO MOCK API CODE
- Use real api.get(), api.post(), api.patch(), api.delete()
- Handle response.data or response.data.data
- Use alert() for errors
- Loading spinner while fetching

STYLING:
- Indigo theme
- Responsive table
- Modal overlays
- Dark mode support
- Clean, modern design

Generate ONLY the complete page.tsx code with NO mock API. Use the real @/lib/api import!
`;

  console.log('🤖 Regenerating Users page with REAL API...');
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let code = response.text();

    // Clean up code blocks
    code = code.replace(/```typescript\n?/g, '');
    code = code.replace(/```tsx\n?/g, '');
    code = code.replace(/```\n?/g, '');

    if (!code.includes("'use client'")) {
      code = "'use client';\n\n" + code;
    }

    const outputPath = '/Users/thangdinh/working/management-user-ai/apps/web/app/dashboard/users/page.tsx';
    fs.writeFileSync(outputPath, code);
    
    console.log('✅ Users page regenerated!');
    console.log('📦 Size:', code.length, 'characters');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

generateUsersPage();
