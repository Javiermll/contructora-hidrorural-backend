# Constructora Hidrorural — Backend API de Contacto

Servidor Node.js/Express que gestiona el envío de correos del formulario de cotización del sitio web de Constructora Hidrorural.

## Descripcion / Objetivo

Microservicio backend que recibe solicitudes de cotización desde el frontend, las valida y las envía por correo electrónico via SMTP (Gmail App Password), con múltiples capas de protección contra spam y abuso.

## Tecnologias y herramientas

- Node.js LTS
- Express
- Nodemailer — envío de correos via SMTP
- express-rate-limit — límite de 10 solicitudes por minuto por IP
- helmet — cabeceras de seguridad HTTP
- cors — restringido al origen del frontend via `.env`
- dotenv — gestión de credenciales SMTP sin exponerlas en el código
- Git / GitHub para control de versiones

## Funcionalidades principales

- **Endpoint `POST /api/contact`:** recibe `nombre`, `correo`, `telefono` y `mensaje`, valida los campos requeridos y envía el correo HTML al destinatario configurado.
- **Proteccion anti-spam (honeypot):** campo oculto `hp` que, si viene relleno, descarta silenciosamente la solicitud — defensa efectiva contra bots.
- **Rate limiting:** máximo 10 requests por minuto por IP para evitar abuso del endpoint.
- **Seguridad de cabeceras:** `helmet` activa CSP, X-Frame-Options, HSTS y otras cabeceras de seguridad HTTP.
- **Escaping HTML:** todos los campos del usuario se escapan antes de incluirse en el correo, previniendo inyección de HTML/XSS.
- **CORS restrictivo:** solo acepta peticiones del origen definido en `FRONTEND_ORIGIN`.

## Rol

Proyecto individual: diseño e implementación completa del servidor, endpoint, validaciones, capas de seguridad y configuración segura de credenciales.

## Resultado / Impacto

- Formulario de cotización funcional en producción, recibiendo solicitudes reales de clientes de Constructora Hidrorural.
- 5 capas de seguridad implementadas: helmet, CORS, rate-limit, honeypot y escaping HTML.
- Credenciales SMTP 100% fuera del código fuente, gestionadas con dotenv.
- `.env` protegido por `.gitignore` — nunca expuesto en historial de git.

## Variables de entorno

Crear `.env` en la raíz (ver `.env.example` como plantilla):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu.cuenta@gmail.com
SMTP_PASS=TU_APP_PASSWORD_SIN_ESPACIOS
SMTP_SECURE=false
FROM_EMAIL="Hidrorural <tu.cuenta@gmail.com>"
TO_EMAIL=contacto@hidrorural.com
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

`SMTP_PASS` debe ser un App Password de Google (Cuenta Google → Seguridad → Contraseñas de aplicación). Nunca poner contraseñas reales en el repositorio.

## Instalacion y ejecucion

```bash
npm install
cp .env.example .env   # completar con valores reales
node server.js
```

Salida esperada: `SMTP transporter OK` y `Contact server listening on 4000`.

## Prueba del endpoint

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","correo":"test@ejemplo.com","telefono":"+56912345678","mensaje":"Consulta de prueba","hp":""}'
```

Respuesta esperada: `{"ok":true}`

## Repositorio

- GitHub: https://github.com/Javiermll/contructora-hidrorural-backend
