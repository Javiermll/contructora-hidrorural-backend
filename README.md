# Constructora Hidrorural — Backend

API REST para el formulario de cotización del sitio web de Constructora Hidrorural. Recibe solicitudes desde el frontend, las valida y las envía por correo vía SMTP.

---

## Stack

- **Node.js** + **Express 5**
- **Nodemailer** — envío de correos via SMTP (Gmail App Password)
- **helmet** — cabeceras de seguridad HTTP
- **express-rate-limit** — máximo 10 requests/min por IP
- **cors** — restringido al origen del frontend
- **dotenv** — credenciales fuera del código fuente
- **Render** — deploy en producción

---

## Endpoint

```
POST /api/contact
```

Campos: `nombre`, `correo`, `telefono`, `mensaje`. Incluye honeypot anti-spam (`hp`) y escaping HTML en el cuerpo del correo.

---

## Variables de entorno

```bash
# .env (ver .env.example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu.cuenta@gmail.com
SMTP_PASS=TU_APP_PASSWORD
SMTP_SECURE=false
FROM_EMAIL="Hidrorural <tu.cuenta@gmail.com>"
TO_EMAIL=contacto@hidrorural.com
FRONTEND_ORIGIN=https://www.hidrorural.com
PORT=4000
```

## Desarrollo local

```bash
npm install
cp .env.example .env
node server.js
# → SMTP transporter OK
# → Contact server listening on 4000
```
