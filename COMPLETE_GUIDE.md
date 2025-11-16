# BOARDING HOUSE MANAGEMENT SYSTEM - COMPLETE GUIDE

## Overview

A complete full-stack web application for managing boarding house operations with real-time updates via WebSocket synchronization.

**Project Location:** `C:\Users\www\Desktop\MY BOARDING`

## Quick Start (5 minutes)

### Step 1: Start Backend (Terminal 1)
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding_house"
.venv\Scripts\activate
python manage.py runserver 127.0.0.1:8000
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Step 2: Start Frontend (Terminal 2)
```powershell
cd "C:\Users\www\Desktop\MY BOARDING\boarding-frontend"
npm start
```

You should see:
```
Compiled successfully!
You can now view boarding-frontend in the browser.
Local: http://localhost:3000
```

### Step 3: Login (Browser)
1. Open http://localhost:3000
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

### Step 4: Test Real-Time Sync
1. Open http://localhost:3000 in **TWO browser tabs**
2. Login in both tabs with admin/admin123
3. In **Tab 1**: Click "Members" → Add a new member
4. In **Tab 2**: Watch the Members list - new member appears instantly
5. Edit the member in Tab 1 - changes appear in Tab 2 in real-time

## Features

### Implemented ✓

| Feature | Status | Notes |
|---------|--------|-------|
| Member Management | ✓ | CRUD, status tracking |
| Task Scheduling | ✓ | Water, Food, Cleaning tasks |
| Payment Tracking | ✓ | Amount, status, collection info |
| Bill Management | ✓ | Water, electricity, balance |
| Repair Requests | ✓ | Cost, status, descriptions |
| JWT Authentication | ✓ | 60-minute token lifetime |
| Real-Time Sync | ✓ | WebSocket broadcasts to all tabs |
| REST API | ✓ | Full CRUD endpoints |
| Admin Panel | ✓ | Django admin at /admin |
| Responsive UI | ✓ | Tailwind CSS responsive design |

## Architecture

### Backend Stack
- **Framework:** Django 5.2.8
- **API:** Django REST Framework 3.16.1
- **Real-Time:** Channels 4.3.1 (WebSocket)
- **Auth:** SimpleJWT (JWT tokens)
- **Database:** SQLite (development)
- **Server:** Django dev server or Daphne ASGI

### Frontend Stack
- **Framework:** React 18.3.1
- **State:** Redux Toolkit 1.9
- **Router:** React Router 6
- **Styling:** Tailwind CSS 3
- **HTTP:** Axios 1.0
- **Server:** Webpack (via create-react-app)

## Data Models

```
Member
├── name (CharField)
├── email (EmailField, unique)
├── contact (CharField)
├── room_number (CharField)
├── status (Active/Inactive)
└── joined_date (DateField, auto)

Schedule
├── task_type (Water/Food/Cleaning)
├── assigned_to (ForeignKey → Member, optional)
├── date (DateField)
├── time (TimeField)
├── description (TextField)
└── completed (BooleanField)

Payment
├── member (ForeignKey)
├── amount (DecimalField)
├── payment_date (DateField, auto)
├── collected_by (CharField)
└── status (Paid/Unpaid)

Bill
├── member (ForeignKey)
├── month (CharField)
├── water_amount (DecimalField)
├── electricity_amount (DecimalField)
├── balance (DecimalField)
└── paid_status (Paid/Unpaid)

Repair
├── member (ForeignKey)
├── item_name (CharField)
├── repair_date (DateField)
├── cost (DecimalField)
├── replaced_by (CharField)
├── status (Pending/Completed)
└── description (TextField)
```

## API Endpoints

### Authentication
```
POST   /api/auth/token/              # Get access + refresh tokens
POST   /api/auth/token/refresh/      # Refresh expired access token
```

### Members
```
GET    /api/members/                 # List all members
POST   /api/members/                 # Create new member
GET    /api/members/{id}/            # Get specific member
PATCH  /api/members/{id}/            # Update member
PUT    /api/members/{id}/            # Replace member
DELETE /api/members/{id}/            # Delete member
```

### Similar endpoints for:
- `/api/schedules/`
- `/api/payments/`
- `/api/bills/`
- `/api/repairs/`

### WebSocket
```
ws://localhost:8000/ws/notifications/

Message Format (from backend):
{
  "model": "member",      # or schedule, payment, bill, repair
  "action": "create",     # or update, delete
  "data": {...}           # Full serialized object
}
```

## Authentication Flow

### 1. Login Request
```javascript
POST http://127.0.0.1:8000/api/auth/token/
{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Token Response
```javascript
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Store in Browser
```javascript
localStorage.setItem('access', tokens.access);
localStorage.setItem('refresh', tokens.refresh);
```

### 4. Use in API Calls
```javascript
headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Token Expiry
- Access token: 60 minutes
- Refresh token: 7 days (default)
- Automatic refresh when access token expires

## Real-Time Sync Explained

### When You Create a Member in Tab 1:

1. **Frontend (Tab 1):**
   - Form submitted → Redux action `addMember` → API POST

2. **Backend:**
   - Member saved to database
   - Django signal `post_save` triggers
   - Serializer converts Member to JSON
   - Channels broadcasts to group 'notifications':
     ```json
     {
       "model": "member",
       "action": "create",
       "data": {"id": 1, "name": "John", ...}
     }
     ```

3. **Frontend (Tab 1 & Tab 2):**
   - WebSocket connection receives message
   - `useNotifications` hook parses action
   - Redux dispatch `addMember(data)`
   - Component re-renders with new member
   - **Result:** Both tabs show new member instantly

### The useNotifications Hook
Located in `src/hooks/useNotifications.js`:
- Runs on component mount (in App.js)
- Connects to `ws://localhost:8000/ws/notifications/`
- Listens for messages from backend
- Dispatches Redux actions for:
  - Members: `addMember`, `updateMember`, `removeMember`
  - Schedules: `addSchedule`, `updateSchedule`, `removeSchedule`
  - Payments: `addPayment`, `updatePayment`, `removePayment`
  - Bills: `addBill`, `updateBill`, `removeBill`
  - Repairs: `addRepair`, `updateRepair`, `removeRepair`

## File Structure

### Backend Key Files
```
boarding_house/
├── core/
│   ├── models.py           → 5 data models
│   ├── serializers.py      → JSON serialization
│   ├── views.py            → API viewsets
│   ├── urls.py             → API URL routing
│   ├── routing.py          → WebSocket URL pattern
│   ├── consumers.py        → WebSocket consumer
│   └── signals.py          → Post-save/delete broadcasts
├── boarding_house/
│   ├── settings.py         → Django config (INSTALLED_APPS, CHANNEL_LAYERS)
│   ├── urls.py             → Root URL router
│   ├── asgi.py             → ASGI app (Channels routing)
│   └── wsgi.py             → WSGI app (production)
└── manage.py               → Django CLI

Database: db.sqlite3 (created after migrations)
```

### Frontend Key Files
```
boarding-frontend/
├── src/
│   ├── App.js              → Main router + navigation
│   ├── pages/
│   │   ├── Login.js        → JWT login form
│   │   ├── Members.js      → Member CRUD page
│   │   ├── Schedules.js    → Schedule CRUD page
│   │   ├── Payments.js     → Payment CRUD page
│   │   ├── Bills.js        → Bill CRUD page
│   │   └── Repairs.js      → Repair CRUD page
│   ├── redux/
│   │   ├── store.js        → Redux store config
│   │   ├── memberSlice.js  → Member state + reducer + thunk
│   │   └── ... (4 more slices)
│   ├── hooks/
│   │   └── useNotifications.js  → WebSocket real-time sync
│   ├── services/
│   │   ├── api.js          → Axios instance with JWT
│   │   └── auth.js         → Login/logout helpers
│   ├── index.js            → React bootstrap
│   └── index.css           → Global Tailwind directives
└── public/
    └── index.html          → HTML entry point

Node dependencies: node_modules/ (installed via npm install)
```

## Common Tasks

### Add a New Member
1. **Via UI:**
   - Login → Members page
   - Fill form fields
   - Click "Add Member"

2. **Via API:**
   ```bash
   curl -X POST http://127.0.0.1:8000/api/members/ \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"name":"John","email":"john@example.com","room_number":"101"}'
   ```

### Update a Member's Room
1. **Via UI:**
   - Members page → Click "Edit" on row
   - Modify room number
   - Click "Save"

2. **Via API:**
   ```bash
   curl -X PATCH http://127.0.0.1:8000/api/members/1/ \
     -H "Authorization: Bearer {token}" \
     -d '{"room_number":"202"}'
   ```

### View All Payments
1. **Via UI:**
   - Login → Payments page
   - Table shows all payment records

2. **Via API:**
   ```bash
   curl http://127.0.0.1:8000/api/payments/ \
     -H "Authorization: Bearer {token}"
   ```

### Schedule a Task
1. **Via UI:**
   - Schedules page → Fill task type, date, time
   - Click "Add Schedule"

2. **Via API:**
   ```bash
   curl -X POST http://127.0.0.1:8000/api/schedules/ \
     -H "Authorization: Bearer {token}" \
     -d '{"task_type":"Water","date":"2025-11-14","time":"09:00:00"}'
   ```

## Troubleshooting

### Backend won't start
```
Error: "ModuleNotFoundError: No module named 'django'"
Solution:
  cd boarding_house
  .venv\Scripts\activate
  pip install -r requirements.txt
```

### Frontend won't start
```
Error: npm ERR! missing: react
Solution:
  cd boarding-frontend
  npm install
```

### Ports already in use
```
Error: "Port 8000/3000 is already in use"
Solution:
  # Find process using port
  netstat -ano | findstr "8000"
  # Kill process
  taskkill /PID {PID} /F
```

### WebSocket not connecting
```
Check browser DevTools → Network → WS
URL should be: ws://localhost:8000/ws/notifications/
If fails: Ensure Daphne/channels installed:
  pip install channels daphne
```

### Tokens not persisting
```
Check browser DevTools → Application → Local Storage
Should have keys: 'access', 'refresh'
If missing: JavaScript might not be saving them (check console errors)
```

### Members not syncing between tabs
```
Check: 
1. Both tabs logged in? (Check localStorage for tokens)
2. WebSocket connected? (DevTools → Network → WS)
3. Backend running? (Check terminal for requests)
4. Redux store loaded? (DevTools → Redux tab)
```

## Performance Tips

### Optimize Queries
```python
# Use select_related for ForeignKey
schedules = Schedule.objects.select_related('assigned_to')
```

### Add Pagination
```python
# In views.py
from rest_framework.pagination import PageNumberPagination
class StandardPagination(PageNumberPagination):
    page_size = 20
```

### Cache Responses
```python
from rest_framework.decorators import cache_page
@cache_page(60 * 5)  # 5 minutes
def list(self, request):
    ...
```

### Reduce State Updates
```javascript
// In Redux thunk, only update changed fields
const updateMember = createAsyncThunk('...',
  async (memberData) => {
    const response = await api.patch(`/members/${id}/`, memberData);
    return response.data;
  }
);
```

## Security Considerations

### In Production
1. Set `DEBUG = False` in settings.py
2. Use environment variables for secrets
3. Enable CSRF protection (already enabled by default)
4. Use HTTPS (set SECURE_SSL_REDIRECT)
5. Rotate SECRET_KEY regularly
6. Use stronger JWT token expiry times
7. Implement rate limiting on auth endpoints
8. Use PostgreSQL instead of SQLite
9. Deploy behind Nginx/Apache reverse proxy
10. Enable CORS only for trusted domains

## Support

### View Logs
```bash
# Backend logs in terminal (automatically printed)
# Frontend logs in browser DevTools Console

# Django logs can be configured in settings.py:
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
}
```

### Database Inspection
```bash
# Django shell
python manage.py shell
>>> from core.models import Member
>>> Member.objects.all()
>>> Member.objects.create(name="John", email="john@example.com")
>>> exit()
```

### Admin Panel
- URL: http://127.0.0.1:8000/admin
- Login: admin / admin123
- Manage all data directly

## Next Steps

1. **Customize Styling:**
   - Edit Tailwind classes in React components
   - Modify tailwind.config.js for custom colors

2. **Add Validations:**
   - Add form field validations in React
   - Add model validators in Django

3. **Deploy:**
   - Build frontend: `npm run build`
   - Use Gunicorn for Django production
   - Deploy to cloud (AWS, Heroku, DigitalOcean)

4. **Enhance Features:**
   - Add search/filter functionality
   - Add data export (PDF/CSV)
   - Add charts and analytics
   - Add email notifications

---

**Happy Coding!** 🚀

For questions or issues, refer to the code comments and Django/React official documentation.
