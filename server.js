const express = require("express");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Seguridad básica
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// CORS: permite el frontend (ajusta FRONTEND_ORIGIN en .env si hace falta)
const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: FRONTEND }));

// Rate limiter para la ruta de contacto
const contactLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// Transporter nodemailer usando variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

transporter
  .verify()
  .then(() => console.log("SMTP transporter OK"))
  .catch((err) => console.error("SMTP transporter error", err));

// Helper: escapar texto para HTML simple
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { nombre, correo, telefono, mensaje, hp } = req.body || {};

    // Honeypot anti-spam: campo oculto que debe venir vacío
    if (hp) return res.status(200).json({ ok: true });

    if (!nombre || !correo || !mensaje)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    // validación sencilla de email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(correo))
      return res.status(400).json({ error: "Email inválido" });

    const html = `
			<h2>Cotización - ${esc(nombre)}</h2>
			<p><strong>Correo:</strong> ${esc(correo)}</p>
			<p><strong>Teléfono:</strong> ${esc(telefono || "")}</p>
			<hr/>
			<div style="white-space:pre-wrap">${esc(mensaje)}</div>
		`;

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.TO_EMAIL || "contacto@hidrorural.com",
      cc: process.env.CC_EMAIL || undefined,
      bcc: process.env.BCC_EMAIL || undefined,
      subject: `Cotización | Hidrorural — ${esc(nombre)}`,
      html,
      replyTo: correo,
    });

    console.log("Mail sent:", info.messageId || info);
    // Logging adicional para diagnosticar entrega
    try {
      console.log("SMTP info.accepted:", info.accepted || []);
      console.log("SMTP info.rejected:", info.rejected || []);
      if (info.response) console.log("SMTP info.response:", info.response);
    } catch (logErr) {
      console.error("Error logging SMTP info:", logErr);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error /api/contact", err);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Contact server listening on ${port}`));
