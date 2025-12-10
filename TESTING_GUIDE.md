# Manual Testing Guide - Management Users API

## 🌐 Access Points

**API Base URL:** http://localhost:3001  
**Swagger Documentation:** http://localhost:3001/api-docs  
**Prisma Studio (Database Viewer):** http://localhost:5555

---

## Method 1: Using Swagger UI (Easiest - Recommended)

### Step 1: Open Swagger
```bash
# In your browser, go to:
http://localhost:3001/api-docs
```

### Step 2: Test Login
1. Click on **"POST /auth/login"**
2. Click **"Try it out"**
3. Edit the request body:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
4. Click **"Execute"**
5. **Copy the `accessToken` from the response!**

### Step 3: Authorize with Token
1. Scroll to top of Swagger page
2. Click the **"Authorize" button** (🔒 lock icon)
3. In the popup, paste your token in the "Value" field:
```
YOUR_ACCESS_TOKEN_HERE
```
4. Click **"Authorize"** then **"Close"**

### Step 4: Test Profile (Protected Endpoint)
1. Click on **"GET /auth/profile"**
2. Click **"Try it out"**
3. Click **"Execute"**
4. ✅ You should see your profile with roles and permissions!

### Step 5: Test Registration
1. Click on **"POST /auth/register"**
2. Click **"Try it out"**
3. Create a new user:
```json
{
  "email": "newuser@example.com",
  "password": "Password@123",
  "firstName": "New",
  "lastName": "User"
}
```
4. Click **"Execute"**
5. ✅ You should get a new user with token!

---

## Method 2: Using Postman

### Step 1: Import Collection

**Create New Collection:**
1. Open Postman
2. Click "New" → "Collection"
3. Name it: "Management Users API"

### Step 2: Add Login Request

**Create Login Request:**
1. Click "+ Add request"
2. Name: "Login"
3. Method: `POST`
4. URL: `http://localhost:3001/auth/login`
5. Go to **"Body"** tab
6. Select **"raw"** and **"JSON"**
7. Add body:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
8. Click **"Send"**
9. ✅ **Copy the `accessToken` from response**

### Step 3: Add Profile Request

**Create Profile Request:**
1. Click "+ Add request"
2. Name: "Get Profile"
3. Method: `GET`
4. URL: `http://localhost:3001/auth/profile`
5. Go to **"Authorization"** tab
6. Type: Select **"Bearer Token"**
7. Token: Paste your access token
8. Click **"Send"**
9. ✅ You should see your profile!

### Step 4: Add Register Request

**Create Register Request:**
1. Click "+ Add request"
2. Name: "Register"
3. Method: `POST`
4. URL: `http://localhost:3001/auth/register`
5. Body:
```json
{
  "email": "john@example.com",
  "password": "John@123456",
  "firstName": "John",
  "lastName": "Doe"
}
```
6. Click **"Send"**

---

## Method 3: Using cURL (Terminal/Command Line)

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["Super Admin"],
    "permissions": ["users.create", "users.read", ...]
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### Get Profile (Use Your Token)
```bash
# Replace YOUR_TOKEN with actual token from login
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Register New User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Jane@123456",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

## Method 4: View Database (Prisma Studio)

### Open Prisma Studio
```bash
cd /Users/thangdinh/working/management-user-ai/apps/api
npx prisma studio
```

**Then open:** http://localhost:5555

### What You Can Do:
- ✅ View all users
- ✅ View all roles
- ✅ View all permissions
- ✅ See user-role relationships
- ✅ See role-permission relationships
- ✅ Edit data directly (be careful!)
- ✅ Delete test users

---

## 🧪 Test Scenarios

### Scenario 1: Login as Admin
```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
✅ **Expected:** Token + 14 permissions

### Scenario 2: Login as Demo User
```json
POST /auth/login
{
  "email": "demo@example.com",
  "password": "Demo@123"
}
```
✅ **Expected:** Token + limited permissions

### Scenario 3: Wrong Password
```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "WrongPassword"
}
```
❌ **Expected:** 401 Unauthorized - "Invalid credentials"

### Scenario 4: Register Duplicate Email
```json
POST /auth/register
{
  "email": "admin@example.com",
  "password": "Test@123",
  "firstName": "Test",
  "lastName": "User"
}
```
❌ **Expected:** 409 Conflict - "User with this email already exists"

### Scenario 5: Access Profile Without Token
```
GET /auth/profile
(No Authorization header)
```
❌ **Expected:** 401 Unauthorized

### Scenario 6: Access Profile With Invalid Token
```
GET /auth/profile
Authorization: Bearer invalid_token_here
```
❌ **Expected:** 401 Unauthorized

---

## 🔍 Check What's in Database

### Quick SQL Queries
```bash
# Connect to database
docker exec -it management-users-db psql -U postgres -d management_users_dev

# View all users
SELECT id, email, "firstName", "lastName", status FROM users;

# View all roles
SELECT * FROM roles;

# View user roles
SELECT u.email, r.name as role 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;

# View role permissions
SELECT r.name as role, p.name as permission 
FROM roles r 
JOIN role_permissions rp ON r.id = rp.role_id 
JOIN permissions p ON rp.permission_id = p.id;

# Exit
\q
```

---

## 📊 Monitoring API Logs

### Watch API Console
The API is running and showing real-time logs. You should see:
- `POST /auth/login 200` - Successful login
- `POST /auth/register 201` - User created
- `GET /auth/profile 200` - Profile fetched
- `POST /auth/login 401` - Failed login

### Example Log Output:
```
[Nest] 56748  - 10/12/2025, 4:32:19 pm     LOG [RouterExplorer] Mapped {/auth/login, POST} route
[Nest] 56748  - 10/12/2025, 4:32:19 pm     LOG [RouterExplorer] Mapped {/auth/register, POST} route
[Nest] 56748  - 10/12/2025, 4:32:19 pm     LOG [RouterExplorer] Mapped {/auth/profile, GET} route
```

---

## 🎯 Quick Test Checklist

- [ ] Open Swagger UI (http://localhost:3001/api-docs)
- [ ] Test login with admin credentials
- [ ] Copy access token
- [ ] Authorize in Swagger (click lock icon)
- [ ] Test profile endpoint
- [ ] Test register with new email
- [ ] Try login with wrong password (should fail)
- [ ] Try accessing profile without token (should fail)
- [ ] Open Prisma Studio to view database
- [ ] Check users table
- [ ] Check roles table
- [ ] Check permissions table

---

## 💡 Pro Tips

1. **Save Token:** After login, save the token in a text file for easy copy-paste
2. **Use Swagger:** It's the easiest way to test - everything is visual
3. **Watch Logs:** Keep an eye on the API console to see what's happening
4. **Check Database:** Use Prisma Studio to verify data is being saved
5. **Test Errors:** Try invalid data to see error handling works

---

## 🆘 Troubleshooting

### Issue: Can't access Swagger
**Solution:**
```bash
# Check if API is running
curl http://localhost:3001

# If not, start it:
cd /Users/thangdinh/working/management-user-ai/apps/api
npm run start:dev
```

### Issue: 401 Unauthorized on Profile
**Solution:**
- Make sure you copied the FULL token
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Token might be expired (7 days expiry) - login again

### Issue: Database connection error
**Solution:**
```bash
# Check if database is running
docker ps | grep management-users-db

# If not running:
cd /Users/thangdinh/working/management-user-ai
docker-compose up -d
```

---

## 📸 Expected Screenshots

### Swagger UI:
1. Green **"POST /auth/login"** with 200 response
2. Green **"POST /auth/register"** with 201 response  
3. Green **"GET /auth/profile"** with 200 response

### Prisma Studio:
1. Users table with 3+ users
2. Roles table with 5 roles
3. Permissions table with 14 permissions

---

**🎉 Happy Testing! Everything should work perfectly!**
