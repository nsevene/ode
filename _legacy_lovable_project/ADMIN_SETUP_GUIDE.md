# 🔐 Admin Setup Guide - ODE Food Hall

## Quick Admin Setup (5 Minutes)

### Step 1: Create Your First Admin User

#### Option A: Through Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project
   - Go to **Authentication** → **Users**

2. **Add User**
   - Click **"Add User"**
   - Email: `admin@odefoodhall.com`
   - Password: `Admin123!` (change this later)
   - Click **"Create User"**

3. **Set Admin Role in Database**
   - Go to **Table Editor** → **profiles**
   - Click **"Insert"** → **"Insert Row"**
   - Fill the form:
     ```
     id: [copy the user ID from auth.users]
     email: admin@odefoodhall.com
     role: admin
     is_active: true
     full_name: System Administrator
     ```
   - Click **"Save"**

#### Option B: SQL Command (Advanced)

```sql
-- 1. Create admin user in auth
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@odefoodhall.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- 2. Create admin profile
INSERT INTO profiles (id, email, role, is_active, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@odefoodhall.com'),
  'admin@odefoodhall.com',
  'admin',
  true,
  'System Administrator'
);
```

### Step 2: Access Admin Panel

1. **Start the application**

   ```bash
   npm run dev
   ```

2. **Open browser**
   - Go to: http://localhost:8080/

3. **Login as admin**
   - Click **"Sign In"**
   - Email: `admin@odefoodhall.com`
   - Password: `Admin123!`

4. **Access admin panel**
   - Go to: http://localhost:8080/admin
   - You should see the admin dashboard

### Step 3: Create Additional Users

1. **From Admin Panel**
   - Go to `/admin/users`
   - Click **"Create User"**
   - Fill the form:
     - Email: `manager@odefoodhall.com`
     - Full Name: `Restaurant Manager`
     - Phone: `+62 812 3456 7890`
     - Role: `tenant`
     - Password: `Manager123!`

2. **User will receive email confirmation**
   - They can login with their credentials
   - Role-based access will be enforced

### Step 4: Test User Roles

#### Test Admin Access

- ✅ Can access `/admin`
- ✅ Can access `/admin/users`
- ✅ Can create/edit users
- ✅ Can change user roles

#### Test Tenant Access

- ✅ Can access `/tenants/*`
- ❌ Cannot access `/admin`
- ✅ Can manage restaurant

#### Test Guest Access

- ✅ Can access `/guest-demo`
- ❌ Cannot access `/admin`
- ❌ Cannot access `/tenants`

---

## 🔧 Troubleshooting

### "Access Denied" Error

**Problem:** Cannot access admin panel
**Solution:**

```sql
-- Check if user has admin role
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';

-- If not admin, update role
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### "User Not Found" Error

**Problem:** User exists in auth but not in profiles
**Solution:**

```sql
-- Create missing profile
INSERT INTO profiles (id, email, role, is_active, full_name)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'user@example.com'),
  'user@example.com',
  'guest',
  true,
  'User Name'
);
```

### Email Not Sending

**Problem:** User registration emails not working
**Solution:**

1. Check Resend API key in `.env`
2. In development, emails are logged to console
3. For production, configure Resend properly

---

## 📋 Admin Checklist

### Initial Setup

- [ ] Create first admin user
- [ ] Test admin login
- [ ] Access admin dashboard
- [ ] Create test users
- [ ] Verify role-based access

### Security Setup

- [ ] Change default admin password
- [ ] Set up email verification
- [ ] Configure RLS policies
- [ ] Test user permissions

### Production Setup

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up email service
- [ ] Deploy application
- [ ] Test all functionality

---

## 🚀 Quick Commands

### Create Admin User (One-liner)

```bash
# Replace with your Supabase project details
curl -X POST 'https://your-project.supabase.co/auth/v1/admin/users' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@odefoodhall.com",
    "password": "Admin123!",
    "user_metadata": {
      "role": "admin",
      "full_name": "System Administrator"
    }
  }'
```

### Check User Roles

```sql
-- View all users and their roles
SELECT email, role, is_active, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Reset User Password

```sql
-- This will require the user to reset password on next login
UPDATE auth.users
SET encrypted_password = NULL
WHERE email = 'user@example.com';
```

---

## 📞 Need Help?

1. **Check the main documentation:** `PROJECT_DOCUMENTATION.md`
2. **Review error logs** in browser console
3. **Check Supabase logs** in dashboard
4. **Contact support:** support@odefoodhall.com

---

**🎉 You're all set! Your admin panel is ready to use.**
