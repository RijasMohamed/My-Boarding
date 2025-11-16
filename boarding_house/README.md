# Boarding House (backend)

This is a minimal scaffold for the Django backend (Django + DRF + SimpleJWT + Channels).

Quick start (Windows PowerShell):

```
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
# Run the development server (Django runserver works for HTTP; for websocket testing use daphne):
python manage.py runserver
# or using daphne:
daphne -b 0.0.0.0 -p 8000 boarding_house.asgi:application
```

Notes:
- The scaffold uses SQLite by default for quick local development. To use Postgres, install Postgres and set DATABASE settings or provide a DATABASE_URL.
- Channels is configured with an in-memory channel layer by default. For multi-process or production use, configure Redis via `channels_redis`.
