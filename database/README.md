# Style Express Limo database

The server uses PostgreSQL whenever `DATABASE_URL` is configured. On startup it applies `migrations/001_admin_portal.sql`, seeds missing content records, and then serves both the public website and admin portal from the same database.

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/style_express_limo"
$env:NODE_ENV="production"
npm.cmd start
```

Set `DATABASE_SSL=false` only for a trusted local PostgreSQL instance without TLS. Uploaded GLB/image binaries remain in `DRIVE_UPLOAD_DIR`; the database stores their metadata and public URLs. In production this directory must be a persistent mounted volume or replaced by object storage.

Without `DATABASE_URL`, development falls back to `server/data/db.json`. This fallback is not intended for multi-instance production deployment.
