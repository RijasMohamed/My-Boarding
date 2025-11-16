# Frontend Quick Start & Debugging Guide

## ✅ IMPROVEMENTS MADE TODAY

1. **Protected Routes** - Redirects to login if not authenticated
2. **Better Error Handling** - All API calls now show error messages
3. **Improved UI** - Better form styling, loading states, empty states
4. **Debug Logging** - Console logs for all API calls and WebSocket connections
5. **Redux Error States** - All slices now track and display errors
6. **Login Page Improvements** - Pre-filled demo credentials, better UX

## 🚀 QUICK START

### Step 1: Start Backend (Terminal 1)
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding_house"
.venv\Scripts\activate
python manage.py runserver
```

✅ You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Step 2: Start Frontend (Terminal 2)
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding-frontend"
npm start
```

✅ You should see:
```
On Your Network: http://192.168.x.x:3000/
Compiled successfully!
```

### Step 3: Test in Browser
1. Open **http://localhost:3000**
2. You should see the **Login Page** with pre-filled credentials
3. Click **Sign in**
4. You should see the **Members Page** with a form to add members
5. Try these actions:
   - ✅ Add a new member
   - ✅ Edit an existing member
   - ✅ Delete a member
   - ✅ Navigate to other pages (Schedules, Payments, Bills, Repairs)

---

## 🔍 DEBUGGING GUIDE

### Issue: Frontend shows "Loading..." and nothing loads

**Solution:** Check browser console for errors
1. Open browser **DevTools** (F12)
2. Go to **Console** tab
3. Look for `[API]`, `[MEMBERS]`, `[WS]` logs
4. Common errors:
   - ❌ `Failed to connect` → Backend not running
   - ❌ `401 Unauthorized` → Token expired, login again
   - ❌ `404 Not Found` → Wrong API endpoint

### Issue: Login fails with "Invalid credentials or backend not reachable"

**Check:**
1. Is backend running? (Should see `127.0.0.1:8000` in terminal)
2. Open browser **Network** tab (F12 → Network)
3. Click Sign in and check the XHR/Fetch request to `/api/auth/token/`
4. Status should be **200** with token in response

**Fix:**
```powershell
# Backend terminal
python manage.py migrate                     # Ensure DB is initialized
python create_superuser.py                   # Ensure admin exists
python manage.py runserver
```

### Issue: Add member button does nothing

**Check:**
1. Look at console for `[MEMBERS] Creating new member:` log
2. If not there → Check form validation (Name and Email required)
3. If there → Check network tab for POST to `/api/members/`

**Fix:**
- Make sure all required fields are filled
- Check that backend is returning 201 Created

### Issue: Member added but doesn't appear in list

**Check:**
1. Refresh page (F5) - does it appear?
   - ✅ YES → Redux syncing issue (minor)
   - ❌ NO → API didn't save it, check backend
2. Open browser DevTools → Network → POST `/api/members/`
3. Check response has `id`, `name`, `email`, `room_number`

### Issue: WebSocket failing (WebSocket connection error)

**This is NORMAL** - The app works fine without WebSocket
- WebSocket is for real-time sync only
- Check console: `[WS] Connection error` is OK
- The app will still work with manual page refreshes

### Issue: "Failed to create member: ..." error message

**Check backend response:**
1. Browser DevTools → Network → POST request
2. Click on that request
3. Go to **Response** tab
4. Read the error message
5. Common errors:
   - `email_invalid` → Invalid email format
   - `email_already_exists` → Duplicate email
   - `required_field_missing` → Required field not filled

---

## 📊 TESTING CHECKLIST

### Test Login
- [ ] Open http://localhost:3000
- [ ] See login form with username/password fields
- [ ] Click "Sign in" with default credentials
- [ ] Should redirect to Members page

### Test Members Page
- [ ] Form has 3 fields: Name, Email, Room Number
- [ ] Add button requires Name and Email
- [ ] Can add member successfully
- [ ] Member appears in table below form
- [ ] Can click Edit button
- [ ] Can make changes and Save
- [ ] Can click Delete button and remove member
- [ ] Table shows "No members yet" when empty

### Test Other Pages
- [ ] Click each nav link: Schedules, Payments, Bills, Repairs
- [ ] Each page loads with empty table initially
- [ ] Can add items to each page
- [ ] Can edit and delete items

### Test Error Handling
- [ ] Try submitting form with empty fields → form won't submit
- [ ] Try adding duplicate email → API error shows in UI
- [ ] Stop backend and try to add member → error message shown
- [ ] WebSocket tab shows connection errors but app still works

### Test Real-Time Sync (Optional)
- [ ] Open http://localhost:3000 in **2 browser tabs**
- [ ] In Tab 1: Add a new member
- [ ] In Tab 2: Member should appear automatically (or refresh to see)
- [ ] Delete in Tab 1: Member disappears from Tab 2

---

## 🎨 UI/UX IMPROVEMENTS

### Forms
- Green "Add" buttons for creation
- Blue "Edit" button to start editing
- Red "Delete" button with confirmation
- Save/Cancel buttons appear only when editing
- Required fields marked with *
- Demo credentials pre-filled on login page

### Messages
- Error messages shown in red boxes
- Loading states show "Loading..." or "Adding..." etc
- Empty states show helpful message
- Success is silent (item just appears/updates)

### Navigation
- Header shows all page links when logged in
- "Logout" button in top right when authenticated
- "Login" link visible when not authenticated
- Login page is full-screen centered

---

## 🐛 COMMON MISTAKES

### ❌ Don't do this:
```
npm start         # Wrong: React might not start
npm run start     # ❌ Will fail
```

### ✅ Do this instead:
```
npm start         # ✅ Correct: This is in package.json
```

### ❌ Don't start backend with:
```
python manage.py runserver 0.0.0.0:8000    # Wrong port
node app.js                                 # Wrong: It's Django not Node
```

### ✅ Do start backend with:
```
python manage.py runserver                  # Uses 127.0.0.1:8000
```

---

## 📝 ENV VARIABLES (Optional)

If you want to use a different backend URL:

**Create `.env` file in `boarding-frontend/`:**
```
REACT_APP_API_BASE=http://192.168.1.100:8000/api
```

Then restart: `npm start`

---

## 🆘 IF NOTHING WORKS

### Nuclear Option - Clean Restart

```powershell
# Terminal 1 - Kill everything
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### Step 1: Verify Backend Setup
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding_house"
.venv\Scripts\activate
python manage.py migrate
python create_superuser.py
python manage.py runserver
# Wait for: "Starting development server at http://127.0.0.1:8000/"
```

### Step 2: Fresh Frontend Start
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding-frontend"
rm -r node_modules
npm install
npm start
# Wait for: "Compiled successfully!"
```

### Step 3: Test
- Open http://localhost:3000
- Login with admin/admin123
- Try to add a member

---

## 📞 HELP

### Check these files for debugging:
- **Backend logs**: Console output when running `python manage.py runserver`
- **Frontend logs**: Browser DevTools → Console (F12)
- **API responses**: Browser DevTools → Network tab → Click requests

### Test API directly:
```powershell
# Get token
curl -X POST http://127.0.0.1:8000/api/auth/token/ `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Get members (replace TOKEN with actual token)
curl http://127.0.0.1:8000/api/members/ `
  -H "Authorization: Bearer TOKEN"
```

---

**Status: ✅ Frontend Ready for Testing**

All core features implemented. Report any issues!
