# API Clientes (Node.js + Express + PostgreSQL) — lista para Render

## 1) Crear DB PostgreSQL
- En Render: añade **PostgreSQL** (Add Database) o usa una externa.
- Copia la `DATABASE_URL` al servicio web como variable de entorno.
- Ejecuta el contenido de `schema.sql` para crear la tabla `clientes`.

## 2) Variables de entorno
```
DATABASE_URL=postgres://usuario:password@host:5432/ingenieria_web1
PGSSL=false   # true si tu proveedor exige SSL
```

## 3) Deploy
- Conecta repo → Web Service → Build: `npm install`, Start: `node server.js`.
- Prueba `GET /clientes`.
