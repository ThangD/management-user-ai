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
    const fullPath = path.join(process.cwd(), outputPath);
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

async function generateRolesPage() {
  const prompt = `
Generate a Next.js 14 client component for a Roles Management page with TypeScript and Tailwind CSS.

IMPORTANT REQUIREMENTS:
- Must be a 'use client' component
- Use TypeScript with proper interfaces
- Use Tailwind CSS for all styling
- Use lucide-react icons: Shield, Plus, Edit, Trash2, Key, X, Search
- Import from '@/lib/api' for API calls (already configured with axios and JWT)
- Follow the EXACT same pattern as the Users page

API ENDPOINTS TO USE:
- GET /roles - fetch all roles with users and permissions count
- POST /roles - create new role { name, description }
- PATCH /roles/:id - update role
- DELETE /roles/:id - delete role
- POST /roles/:id/permissions - assign permissions { permissionIds: string[] }
- GET /permissions - fetch all permissions for assignment

ROLE INTERFACE:
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

FEATURES TO IMPLEMENT:
1. Display roles in a grid of cards (not table)
2. Each card shows: role name, description, user count, permission count
3. Search bar to filter roles by name
4. "Create Role" button opens modal
5. Edit button on each card (disabled for system roles)
6. Delete button on each card (disabled for system roles, shows warning)
7. "Assign Permissions" button opens modal with checkboxes grouped by resource
8. Show badge for system roles that cannot be modified

MODALS NEEDED:
1. Create Role Modal - name, description fields
2. Edit Role Modal - name, description (disable name for system roles)
3. Delete Confirmation Modal - warning about system roles and user assignments
4. Assign Permissions Modal - checkboxes grouped by resource (users, roles, permissions, settings, audit)

VALIDATION:
- Cannot delete/edit system roles (isSystem === true)
- Show warning if role has users assigned
- Name is required and must be unique
- Description is optional

STYLING:
- Use same color scheme as Users page (indigo primary)
- Cards with shadow and hover effects
- Responsive grid: 1 column mobile, 2 tablet, 3 desktop
- Modal overlay with backdrop
- Loading spinner while fetching
- Empty state if no roles

ERROR HANDLING:
- Show alert() for errors (we'll improve this later)
- Display loading state while fetching data
- Handle API errors gracefully

GENERATE ONLY THE COMPONENT CODE. No explanations, just the complete .tsx file content.
`;

  await generateComponent(prompt, 'app/dashboard/roles/page.tsx');
}

async function generatePermissionsPage() {
  const prompt = `
Generate a Next.js 14 client component for a Permissions Management page with TypeScript and Tailwind CSS.

IMPORTANT REQUIREMENTS:
- Must be a 'use client' component
- Use TypeScript with proper interfaces
- Use Tailwind CSS for all styling
- Use lucide-react icons: Key, Plus, Trash2, Shield, X, Search
- Import from '@/lib/api' for API calls
- Simpler than roles/users - mainly read-only with create/delete

API ENDPOINTS TO USE:
- GET /permissions - fetch all permissions
- POST /permissions - create new permission { name, resource, action, description }
- DELETE /permissions/:id - delete permission

PERMISSION INTERFACE:
interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  roleCount: number;
  rolePermissions: Array<{
    role: {
      name: string;
    };
  }>;
  createdAt: string;
}

FEATURES TO IMPLEMENT:
1. Display permissions grouped by resource in accordion/sections
2. Resources: users, roles, permissions, settings, audit
3. Each permission shows: name, action, description, roles count
4. Search bar to filter permissions
5. "Create Permission" button opens modal
6. Delete button (show warning if used by roles)
7. Show which roles have each permission

LAYOUT:
- Group permissions by resource
- Each resource is a collapsible section
- Within each section, show permissions as cards
- Each card: permission name, action badge, description, roles using it

CREATE PERMISSION MODAL:
- Resource: dropdown (users, roles, permissions, settings, audit)
- Action: dropdown (create, read, update, delete, manage)
- Description: optional text area
- Auto-generate name from resource.action (e.g., "users.create")

STYLING:
- Use indigo color scheme
- Action badges: different colors per action (create=green, read=blue, update=yellow, delete=red, manage=purple)
- Resource sections with borders
- Cards with hover effects
- Responsive layout

GENERATE ONLY THE COMPONENT CODE. No explanations, just the complete .tsx file content.
`;

  await generateComponent(prompt, 'app/dashboard/permissions/page.tsx');
}

// Main execution
async function main() {
  console.log('🚀 Starting UI Generation with Gemini AI...\n');
  
  try {
    console.log('📄 Generating Roles Management Page...');
    await generateRolesPage();
    console.log('');
    
    console.log('📄 Generating Permissions Management Page...');
    await generatePermissionsPage();
    console.log('');
    
    console.log('✅ All components generated successfully!');
    console.log('\n🎯 Next steps:');
    console.log('1. Review the generated files');
    console.log('2. Test in browser at http://localhost:3000');
    console.log('3. Make any necessary adjustments');
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
