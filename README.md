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

## Desarrollo local

```bash
npm install
cp .env.example .env
node server.js
# → SMTP transporter OK
# → Contact server listening on 4000
```
