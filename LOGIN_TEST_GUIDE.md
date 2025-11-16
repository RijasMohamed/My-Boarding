# LOGIN & FULL TEST GUIDE

**Date:** November 13, 2025  
**Status:** Both servers running - Ready to test  

---

## ✅ SERVERS RUNNING

### Backend ✅
- URL: `http://127.0.0.1:8000`
- Status: Running on port 8000
- API: `http://127.0.0.1:8000/api/`
- Login tested: ✅ Returns valid JWT tokens

### Frontend ✅
- URL: `http://localhost:3000`
- Status: Running on port 3000
- React dev server active

---

## 🔐 LOGIN TEST FLOW

### What Happens When You Click "Sign in" (admin/admin123)

1. **Frontend sends POST request:**
   ```
   POST http://127.0.0.1:8000/api/auth/token/
   Body: {"username":"admin","password":"admin123"}
   ```

2. **Backend returns JWT tokens:**
   ```json
   {
     "access": "eyJ...",  // Access token (1 hour expiry)
     "refresh": "eyJ..."  // Refresh token (24 hour expiry)
   }
   ```

3. **Frontend stores in localStorage:**
   ```javascript
   localStorage.setItem('access', access_token)
   localStorage.setItem('refresh', refresh_token)
   ```

4. **Frontend redirects to Members page**

5. **All future API calls include token:**
   ```
   Authorization: Bearer {access_token}
   ```

---

## 📋 STEP-BY-STEP TEST

### Step 1: Open Browser
```
http://localhost:3000
```
✅ You should see **Login Page**

### Step 2: Check Pre-filled Credentials
- Username field: Should show `admin`
- Password field: Should show `admin123`
✅ If empty, scroll down - they're pre-filled!

### Step 3: Click "Sign in"
```
What to look for:
- Button should disable ("Signing in...")
- Should redirect quickly to Members page
- No error message should appear
```

### Step 4: Check Console Logs
Open DevTools: **F12** → **Console** tab

You should see:
```
[APP] User authenticated
[MEMBERS] Fetching members...
[REDUX-MEMBERS] Fetching members from API
[REDUX-MEMBERS] Received: [...]
[WS] Attempting to connect to: ws://127.0.0.1:8000/ws/notifications/
[WS] Connected successfully
```

### Step 5: Test Members Page
```
Actions to try:
1. Click "Add Member" button
   - Enter: Name = "John Doe"
   - Enter: Email = "john@example.com"
   - Enter: Room = "101"
   - Click "Add Member"
   - Check: Member appears in table

2. Click "Edit" on the member
   - Change name to "John Smith"
   - Click "Save"
   - Check: Table updates immediately

3. Click "Delete" on the member
   - Confirm deletion
   - Check: Member removed from table
```

### Step 6: Test Other Pages
Navigate to:
- ✅ Schedules page
- ✅ Payments page
- ✅ Bills page
- ✅ Repairs page

Each should:
- Load without errors
- Show empty table with "Add [Item]" form
- Let you add test data

### Step 7: Test Real-time Sync (Optional)
```
1. Open http://localhost:3000 in Tab 1 (Members page)
2. Open http://localhost:3000 in Tab 2 (also login)
3. In Tab 1, add a member: "Jane Doe"
4. Switch to Tab 2 - should see "Jane Doe" appear automatically!
```

---

## 🐛 TROUBLESHOOTING

### Problem: Login Page Shows, But Button Doesn't Work

**Check:**
1. Open DevTools (F12) → Console
2. Look for errors like:
   - `GET http://127.0.0.1:8000/api/auth/token/ 404` 
   - `Failed to fetch`
   - `Network error`

**Solution:**
- Backend might have crashed
- Check backend terminal for errors
- Restart with: `python manage.py runserver`

### Problem: Redirects to Login After Clicking Sign in

**Check:**
1. Did the request go through? (Check Network tab in DevTools)
2. Did you see error in console?

**Solutions:**
- Wait a few seconds - server might be slow
- Check that backend terminal shows no errors
- Try again

### Problem: Members Page Blank

**Check:**
1. Open DevTools (F12) → Console
2. Should see: `[REDUX-MEMBERS] Received: [...]`

**If you see error:**
- "Failed to fetch members"
- Check backend terminal for errors
- Restart backend

### Problem: Nothing Works - Complete Reset

```powershell
# Clear frontend cache
rm -r "C:\Users\www\Desktop\MY BOARDING\boarding-frontend\node_modules\.cache"

# Clear browser storage
# In browser console: localStorage.clear()

# Restart both servers
```

---

## 📊 EXPECTED RESPONSES

### Login Success (200 OK)
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
→ Redirects to Members page

### Login Failure (401 Unauthorized)
```json
{
  "detail": "Invalid credentials"
}
```
→ Shows red error message: "Invalid credentials or backend not reachable"

### Add Member Success (201 Created)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "room_number": "101"
}
```
→ Member appears in table

### API Error (500)
```json
{
  "detail": "Internal server error"
}
```
→ Shows error message in red

---

## 🎯 SUCCESS CHECKLIST

- [ ] Login page loads
- [ ] Pre-filled username/password visible
- [ ] Click "Sign in" redirects to Members
- [ ] Console shows [APP] and [MEMBERS] logs
- [ ] Can add a member
- [ ] Member appears in table
- [ ] Can edit member
- [ ] Edit saves successfully
- [ ] Can delete member
- [ ] Deleted member removed from table
- [ ] Other pages (Schedules, Payments, etc.) load
- [ ] Can add test data on each page
- [ ] No errors in console (except maybe yellow warnings)

---

## 🔑 CONSOLE LOG LEGEND

```
[APP]              = App.js component events
[APP] User authenticated = User has valid token
[APP] No token found = User needs to login
[APP] User logged out = Logout successful

[MEMBERS]          = Members page events
[MEMBERS] Fetching members... = Loading data
[MEMBERS] Creating new member: ... = Adding member

[REDUX-MEMBERS]    = Redux state updates
[REDUX-MEMBERS] Fetching members from API = API call started
[REDUX-MEMBERS] Received: [...] = API response received
[REDUX-MEMBERS] Error: ... = API error

[API]              = Axios requests (if enabled)

[WS]               = WebSocket events
[WS] Connecting... = Trying to connect
[WS] Connected successfully = Real-time sync active
[WS] Message received: ... = Server sent update
```

---

## 📞 QUICK COMMANDS

**Check if backend is running:**
```powershell
Invoke-WebRequest http://127.0.0.1:8000/api/members/ -Headers @{Authorization="Bearer fake"} | Select-Object StatusCode
```

**Test login endpoint:**
```powershell
$body = @{username="admin"; password="admin123"} | ConvertTo-Json
Invoke-WebRequest http://127.0.0.1:8000/api/auth/token/ -Method POST -Body $body -ContentType "application/json"
```

**Check frontend is running:**
```powershell
Invoke-WebRequest http://localhost:3000 | Select-Object StatusCode
```

---

## ✅ FINAL STATUS

**Backend:** ✅ Running & tested (tokens working)  
**Frontend:** ✅ Running & compiled  
**Database:** ✅ Ready (migrations applied)  
**API:** ✅ Responding to requests  
**Ready to test:** ✅ YES!

Go to **http://localhost:3000** and try the login!
