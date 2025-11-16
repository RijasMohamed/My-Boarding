# BOARDING HOUSE SYSTEM - PROJECT MAP

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BOARDING HOUSE MANAGEMENT SYSTEM              │
│                         Full-Stack Web App                       │
│                                                                   │
│  Status: ✓ COMPLETE    Version: 1.0    Date: Nov 13, 2025       │
└─────────────────────────────────────────────────────────────────┘

                            FRONTEND (React)
                    http://localhost:3000
        ┌──────────────────────────────────────────────┐
        │                                              │
        │  Browser & UI Layer                         │
        │  ├─ React 18.3.1                           │
        │  ├─ React Router 6                         │
        │  ├─ Redux Toolkit 1.9                      │
        │  ├─ Tailwind CSS 3                         │
        │  ├─ Axios 1.0 (HTTP)                       │
        │  └─ WebSocket (Real-time)                  │
        │                                              │
        │  Pages (6):                                 │
        │  ├─ Login.js        (JWT credentials)       │
        │  ├─ Members.js      (CRUD members)         │
        │  ├─ Schedules.js    (CRUD schedules)       │
        │  ├─ Payments.js     (CRUD payments)        │
        │  ├─ Bills.js        (CRUD bills)           │
        │  └─ Repairs.js      (CRUD repairs)         │
        │                                              │
        │  Redux (5 Slices):                          │
        │  ├─ memberSlice      + fetchMembers        │
        │  ├─ scheduleSlice    + fetchSchedules      │
        │  ├─ paymentSlice     + fetchPayments       │
        │  ├─ billSlice        + fetchBills          │
        │  └─ repairSlice      + fetchRepairs        │
        │                                              │
        │  Real-Time:                                 │
        │  └─ useNotifications Hook                  │
        │     (WebSocket listener → Redux dispatcher) │
        └────────────────────────┬─────────────────────┘
                                 │
                      HTTP + WebSocket
                                 │
        ┌────────────────────────┴─────────────────────┐
        │                                              │
        │             BACKEND (Django)                 │
        │         http://127.0.0.1:8000/api            │
        │                                              │
        ├──────────────────────────────────────────────┤
        │                                              │
        │  API Layer (REST)                           │
        │  ├─ 28 Endpoints                            │
        │  ├─ JWT Authentication                      │
        │  ├─ CORS Enabled                            │
        │  └─ DRF 3.16.1                              │
        │                                              │
        │  Core App:                                  │
        │  ├─ views.py       (5 ViewSets)             │
        │  ├─ serializers.py (5 Serializers)          │
        │  ├─ urls.py        (Router)                 │
        │  ├─ signals.py     (Real-time)              │
        │  ├─ consumers.py   (WebSocket)              │
        │  └─ routing.py     (WS Routes)              │
        │                                              │
        │  Models (5):                                │
        │  ├─ Member         (name, email, etc)       │
        │  ├─ Schedule       (tasks, dates, times)    │
        │  ├─ Payment        (amounts, status)        │
        │  ├─ Bill           (utilities, balance)     │
        │  └─ Repair         (items, costs, status)   │
        │                                              │
        │  WebSocket (Real-Time):                     │
        │  ├─ Channels 4.3.1                          │
        │  ├─ AsyncJsonWebsocketConsumer              │
        │  ├─ Group Broadcasting                      │
        │  └─ Django Signals                          │
        │                                              │
        │  Authentication:                            │
        │  ├─ SimpleJWT                               │
        │  ├─ Access Token (60 min)                   │
        │  ├─ Refresh Token (7 days)                  │
        │  └─ Bearer Token in Headers                 │
        │                                              │
        └────────────────────────┬─────────────────────┘
                                 │
                         SQLite / PostgreSQL
                                 │
        ┌────────────────────────┴─────────────────────┐
        │                                              │
        │             DATABASE (SQLite)                │
        │          db.sqlite3 (Development)            │
        │                                              │
        │  Tables:                                    │
        │  ├─ auth_user          (Django auth)        │
        │  ├─ auth_group                              │
        │  ├─ auth_permission                         │
        │  ├─ core_member        (Your data)          │
        │  ├─ core_schedule                           │
        │  ├─ core_payment                            │
        │  ├─ core_bill                               │
        │  ├─ core_repair                             │
        │  └─ [8 more Django internals]               │
        │                                              │
        │  Total: 12 tables                           │
        │                                              │
        └──────────────────────────────────────────────┘


                        DATA FLOW DIAGRAM

        User Action in Browser
              │
              ▼
        React Component
              │
              ├──► Form Validation
              │
              ▼
        Redux Action Creator
              │
              ├──► Async Thunk
              │
              ▼
        Axios HTTP Request
              │
              ├──► Add JWT Token Header
              │
              ▼
        Django API Endpoint
              │
              ├──► Validate Token
              ├──► Parse Request
              │
              ▼
        Database Operation
              │
              ├──► INSERT / UPDATE / DELETE
              │
              ▼
        Django Signal
              │
              ├──► Serialize Data
              ├──► Create JSON
              │
              ▼
        Channels Group
              │
              ├──► Broadcast to WebSocket
              │
              ▼
        Browser WebSocket
              │
              ├─(All Connected Browsers)─┐
              │                          │
              ▼                          ▼
        useNotifications Hook     useNotifications Hook
              │                          │
              ├──► Parse Message        ├──► Parse Message
              ├──► Extract Action       ├──► Extract Action
              │                          │
              ▼                          ▼
        Redux Dispatch              Redux Dispatch
              │                          │
              ├──► Update State         ├──► Update State
              │                          │
              ▼                          ▼
        Component Re-render        Component Re-render
              │                          │
              ▼                          ▼
        Tab 1 Updated              Tab 2 Updated
        (Instantly)                (Instantly)


                    FILE STRUCTURE

📦 MY BOARDING/
│
├── 📁 boarding_house/              [BACKEND]
│   ├── 📁 core/                   # Main Django app
│   │   ├── models.py             # 5 data models
│   │   ├── serializers.py        # DRF serializers
│   │   ├── views.py              # API viewsets
│   │   ├── urls.py               # URL routing
│   │   ├── routing.py            # WebSocket routing
│   │   ├── consumers.py          # WebSocket consumer
│   │   ├── signals.py            # Django signals
│   │   ├── admin.py              # Admin config
│   │   ├── apps.py               # App config
│   │   └── migrations/           # Database migrations
│   │
│   ├── 📁 boarding_house/        # Project settings
│   │   ├── settings.py           # Django config
│   │   ├── urls.py               # Root router
│   │   ├── asgi.py               # Channels config
│   │   └── wsgi.py               # Production
│   │
│   ├── manage.py                 # Django CLI
│   ├── db.sqlite3                # SQLite database
│   ├── requirements.txt           # Python dependencies
│   ├── run_migrations.py         # Migration script
│   ├── create_superuser.py       # User creation
│   └── .venv/                    # Virtual environment
│
├── 📁 boarding-frontend/           [FRONTEND]
│   ├── 📁 src/
│   │   ├── 📁 pages/             # 6 page components
│   │   │   ├── Login.js
│   │   │   ├── Members.js
│   │   │   ├── Schedules.js
│   │   │   ├── Payments.js
│   │   │   ├── Bills.js
│   │   │   └── Repairs.js
│   │   │
│   │   ├── 📁 redux/             # Redux state
│   │   │   ├── store.js          # Store config
│   │   │   ├── memberSlice.js
│   │   │   ├── scheduleSlice.js
│   │   │   ├── paymentSlice.js
│   │   │   ├── billSlice.js
│   │   │   └── repairSlice.js
│   │   │
│   │   ├── 📁 services/          # API services
│   │   │   ├── api.js            # Axios instance
│   │   │   └── auth.js           # Auth helpers
│   │   │
│   │   ├── 📁 hooks/             # React hooks
│   │   │   └── useNotifications.js  # WebSocket
│   │   │
│   │   ├── App.js                # Main routing
│   │   ├── index.js              # React bootstrap
│   │   ├── index.css             # Global styles
│   │   └── index.html
│   │
│   ├── package.json              # Dependencies
│   ├── tailwind.config.js        # CSS config
│   ├── postcss.config.js         # PostCSS config
│   └── node_modules/             # Installed packages
│
├── 📁 .github/
│   └── copilot-instructions.md   # AI guidance
│
├── 📄 README.md                  # Main documentation
├── 📄 START_HERE.md              # Quick start
├── 📄 COMPLETE_GUIDE.md          # Detailed guide
├── 📄 PROJECT_STATUS.md          # Feature list
├── 📄 FINAL_CHECKLIST.md         # Verification
├── 📄 test_integration.py        # Test script
└── 📄 .vscode/extensions.json    # Recommended extensions


                    ENDPOINT SUMMARY

╔═══════════════════════════════════════════════════════════════╗
║                    API ENDPOINTS (28)                         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Authentication (2):                                         ║
║  POST /api/auth/token/              (Login)                 ║
║  POST /api/auth/token/refresh/      (Refresh)               ║
║                                                               ║
║  Members (5):                                                ║
║  GET    /api/members/               (List)                  ║
║  POST   /api/members/               (Create)                ║
║  GET    /api/members/{id}/          (Retrieve)              ║
║  PATCH  /api/members/{id}/          (Update)                ║
║  DELETE /api/members/{id}/          (Delete)                ║
║                                                               ║
║  Schedules (5):                                              ║
║  GET    /api/schedules/             (List)                  ║
║  POST   /api/schedules/             (Create)                ║
║  GET    /api/schedules/{id}/        (Retrieve)              ║
║  PATCH  /api/schedules/{id}/        (Update)                ║
║  DELETE /api/schedules/{id}/        (Delete)                ║
║                                                               ║
║  Payments (5):                                               ║
║  GET    /api/payments/              (List)                  ║
║  POST   /api/payments/              (Create)                ║
║  GET    /api/payments/{id}/         (Retrieve)              ║
║  PATCH  /api/payments/{id}/         (Update)                ║
║  DELETE /api/payments/{id}/         (Delete)                ║
║                                                               ║
║  Bills (5):                                                  ║
║  GET    /api/bills/                 (List)                  ║
║  POST   /api/bills/                 (Create)                ║
║  GET    /api/bills/{id}/            (Retrieve)              ║
║  PATCH  /api/bills/{id}/            (Update)                ║
║  DELETE /api/bills/{id}/            (Delete)                ║
║                                                               ║
║  Repairs (5):                                                ║
║  GET    /api/repairs/               (List)                  ║
║  POST   /api/repairs/               (Create)                ║
║  GET    /api/repairs/{id}/          (Retrieve)              ║
║  PATCH  /api/repairs/{id}/          (Update)                ║
║  DELETE /api/repairs/{id}/          (Delete)                ║
║                                                               ║
║  WebSocket (1):                                              ║
║  WS  ws://localhost:8000/ws/notifications/  (Real-time)     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝


                    QUICK REFERENCE

┌─────────────────────────────────────────────────────────────┐
│                 HOW TO START THE SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Terminal 1:                                              │
│  $ cd "C:\Users\www\Desktop\MY BOARDING\boarding_house"  │
│  $ .venv\Scripts\activate                                 │
│  $ python manage.py runserver 127.0.0.1:8000            │
│                                                             │
│  Terminal 2:                                              │
│  $ cd "C:\Users\www\Desktop\MY BOARDING\boarding-frontend"│
│  $ npm start                                              │
│                                                             │
│  Browser:                                                 │
│  URL: http://localhost:3000                              │
│  Login: admin / admin123                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   LOGIN CREDENTIALS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Username: admin                                          │
│  Password: admin123                                       │
│                                                             │
│  These were created during initial setup                  │
│  Change in Django admin: /admin                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   KEY ENDPOINTS                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend:   http://localhost:3000                        │
│  Backend:    http://127.0.0.1:8000                        │
│  Admin:      http://127.0.0.1:8000/admin                 │
│  API Root:   http://127.0.0.1:8000/api                   │
│  WebSocket:  ws://localhost:8000/ws/notifications/       │
│                                                             │
└─────────────────────────────────────────────────────────────┘


Generated: November 13, 2025
Version: 1.0 Complete
