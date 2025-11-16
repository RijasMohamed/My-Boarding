# Boarding House Management System

A full-stack web application for managing boarding house operations with Django backend and React frontend.

## Project Structure

```
MY BOARDING/
├── boarding_house/              # Django Backend
│   ├── manage.py
│   ├── db.sqlite3              # SQLite database
│   ├── requirements.txt         # Python dependencies
│   ├── boarding_house/         # Project settings
│   │   ├── settings.py         # Django configuration
│   │   ├── urls.py             # URL routing
│   │   ├── asgi.py             # ASGI config (Channels/WebSocket)
│   │   └── wsgi.py             # WSGI config
│   └── core/                   # Main app
│       ├── models.py           # Member, Schedule, Payment, Bill, Repair
│       ├── serializers.py      # DRF serializers
│       ├── views.py            # API viewsets
│       ├── routing.py          # WebSocket routing
│       ├── consumers.py        # WebSocket consumer
│       ├── signals.py          # Django signals (real-time broadcasts)
│       └── admin.py            # Django admin
│
├── boarding-frontend/           # React Frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js              # Main routing
│   │   ├── pages/
│   │   │   ├── Login.js        # JWT login form
│   │   │   ├── Members.js      # Member CRUD
│   │   │   ├── Schedules.js    # Schedule CRUD
│   │   │   ├── Payments.js     # Payment CRUD
│   │   │   ├── Bills.js        # Bill CRUD
│   │   │   └── Repairs.js      # Repair CRUD
│   │   ├── redux/
│   │   │   ├── store.js        # Redux configuration
│   │   │   ├── memberSlice.js
│   │   │   ├── scheduleSlice.js
│   │   │   ├── paymentSlice.js
│   │   │   ├── billSlice.js
│   │   │   └── repairSlice.js
│   │   ├── services/
│   │   │   ├── api.js          # Axios with JWT injection
│   │   │   └── auth.js         # Auth helpers
│   │   └── hooks/
│   │       └── useNotifications.js  # WebSocket real-time sync
│   └── tailwind.config.js      # CSS configuration
│
└── .github/
    └── copilot-instructions.md # AI coding agent guidance
```

## Technology Stack

**Backend:**
- Django 5.2.8
- Django REST Framework 3.16.1
- Channels 4.3.1 (WebSocket support)
- SimpleJWT (JWT authentication)
- SQLite (development database)

**Frontend:**
- React 18.3.1
- Redux Toolkit 1.9 (state management)
- React Router 6 (routing)
- Tailwind CSS 3 (styling)
- Axios 1.0 (HTTP client)

## Setup Instructions

### Backend Setup

1. **Create and activate Python virtual environment:**
   ```bash
   cd boarding_house
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py makemigrations core
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   # Or run the helper script:
   python create_superuser.py  # Creates admin/admin123
   ```

5. **Start Django development server:**
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```

   Backend API available at: `http://127.0.0.1:8000/api/`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd boarding-frontend
   npm install
   ```

2. **Start React development server:**
   ```bash
   npm start
   ```

   Frontend available at: `http://localhost:3000`

## API Endpoints

**Authentication:**
- `POST /api/auth/token/` - Get JWT access token (username + password)
- `POST /api/auth/token/refresh/` - Refresh expired token

**CRUD Endpoints (all authenticated):**
- `/api/members/` - Create, Read, Update, Delete members
- `/api/schedules/` - Manage task schedules
- `/api/payments/` - Track member payments
- `/api/bills/` - Monthly bills per member
- `/api/repairs/` - Maintenance repair requests

**WebSocket:**
- `ws://localhost:8000/ws/notifications/` - Real-time updates for all entities

## Data Models

### Member
- name, email, contact, room_number
- status (Active/Inactive)
- joined_date

### Schedule  
- task_type (Water/Food/Cleaning)
- assigned_to (Member, optional)
- date, time, description
- completed (boolean)

### Payment
- member (ForeignKey)
- amount, payment_date, status (Paid/Unpaid)
- collected_by

### Bill
- member (ForeignKey)
- month, water_amount, electricity_amount
- balance, paid_status (Paid/Unpaid)

### Repair
- member (ForeignKey)
- item_name, repair_date, cost
- replaced_by, status (Pending/Completed)
- description

## Authentication Flow

1. User logs in at `/login` with username/password
2. Backend returns `access_token` and `refresh_token`
3. Tokens stored in browser localStorage
4. Frontend injects `Authorization: Bearer {access_token}` in all API requests
5. Tokens expire after 60 minutes (configurable in settings.py)

## Real-Time Updates via WebSocket

### On Backend:
- Django signals listen for post_save/post_delete events on models
- Signal handlers broadcast changes to WebSocket group 'notifications'
- Changes include: model name, action (create/update/delete), and data

### On Frontend:
- `useNotifications` hook connects to WebSocket on app mount
- Listens for JSON messages with structure: `{model, action, data}`
- Dispatches Redux actions to update state in real-time
- Changes in one browser tab automatically reflect in all other tabs

## Testing

**Run full-stack integration test:**
```bash
cd MY BOARDING
python boarding_house\.venv\Scripts\python.exe test_integration.py
```

Tests:
- JWT authentication
- Member CRUD operations
- Schedule CRUD operations
- Payment CRUD operations
- Bill CRUD operations
- Repair CRUD operations
- DELETE operations
- Database persistence

**Manual end-to-end test:**
1. Open http://localhost:3000 in two browser tabs
2. Login with admin/admin123 in both tabs
3. In Tab 1, navigate to Members page and add a member
4. In Tab 2, watch the Members list - new member appears automatically
5. Edit the member in Tab 1 - changes appear in Tab 2 in real-time
6. Repeat for other entity pages (Schedules, Payments, Bills, Repairs)

## Development

### Adding a New Entity

1. **Backend:**
   - Add model in `core/models.py`
   - Create serializer in `core/serializers.py`
   - Create viewset in `core/views.py`
   - Register in `core/urls.py`
   - Add signal handlers in `core/signals.py` for real-time sync
   - Run migrations: `python manage.py makemigrations` && `python manage.py migrate`

2. **Frontend:**
   - Create Redux slice in `src/redux/` (e.g., `entitySlice.js`)
   - Create page component in `src/pages/` (e.g., `Entity.js`)
   - Add route in `App.js`
   - Add nav link in `App.js`
   - Redux actions automatically trigger WebSocket updates via signal handlers

### Environment Variables

**Backend (.env or settings.py):**
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True (development)
DATABASE_URL=sqlite:///db.sqlite3 (default)
```

**Frontend (.env):**
```
REACT_APP_API_BASE=http://127.0.0.1:8000/api
```

## Troubleshooting

**Backend won't connect:**
- Ensure Django is running: `python manage.py runserver 127.0.0.1:8000`
- Check database exists: `python manage.py migrate`
- Verify settings.py has correct INSTALLED_APPS (rest_framework, channels, core)

**WebSocket not syncing:**
- Check browser console for JS errors
- Verify WebSocket connection: `ws://localhost:8000/ws/notifications/` in browser DevTools
- Ensure signal handlers are imported in `core/apps.py`

**Frontend won't load:**
- Check Node.js version: `node --version` (should be 14+)
- Clear node_modules and reinstall: `rm -r node_modules package-lock.json && npm install`
- Check port 3000 is available: `lsof -i :3000` (macOS/Linux)

## Production Deployment

**Backend:**
- Use Gunicorn or Daphne as ASGI server
- Use PostgreSQL instead of SQLite
- Use Redis for Channels layer
- Set DEBUG=False in settings
- Use environment variables for secrets

**Frontend:**
- Build production bundle: `npm run build`
- Deploy static files to CDN or web server
- Set REACT_APP_API_BASE to production backend URL

## License

MIT

## Author

AI Coding Agent (Copilot)
#   M y - B o a r d i n g  
 