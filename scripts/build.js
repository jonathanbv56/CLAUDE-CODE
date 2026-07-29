#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// scripts/build.js — Inyecta las Environment Variables en index.html
// ════════════════════════════════════════════════════════════════
// Qué hace:
//   1) Lee SUPABASE_URL y SUPABASE_KEY de process.env (Vercel las
//      inyecta ahí automáticamente durante el build si están
//      configuradas en el proyecto → Settings → Environment Variables).
//   2) Si no están (ej: build local), intenta completarlas leyendo un
//      archivo ".env" en la raíz del proyecto (formato CLAVE=valor).
//   3) Si después de eso siguen faltando, FALLA el build con un
//      mensaje claro — mejor que desplegar una app rota en silencio.
//   4) Reemplaza los tokens __SUPABASE_URL__ / __SUPABASE_KEY__ en
//      index.html por los valores reales (usando JSON.stringify para
//      que quede como un string de JS válido y escapado) y escribe el
//      resultado en dist/index.html.
//
// No usa ninguna dependencia externa (cero "npm install" necesario).
// ════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_HTML = path.join(ROOT, 'index.html');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_HTML = path.join(OUT_DIR, 'index.html');
const REQUIRED_VARS = ['SUPABASE_URL', 'SUPABASE_KEY'];

function loadDotEnvFallback() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // No pisa una variable que Vercel/el entorno ya haya provisto.
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function main() {
  loadDotEnvFallback();

  const missing = REQUIRED_VARS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('\n❌ Build cancelado: faltan variables de entorno requeridas:');
    missing.forEach((k) => console.error('   - ' + k));
    console.error('\n   → En Vercel: Project Settings → Environment Variables → agregá');
    console.error('     SUPABASE_URL y SUPABASE_KEY (para Production, Preview y Development).');
    console.error('   → En local: creá un archivo ".env" en la raíz (mirá .env.example).\n');
    process.exit(1);
  }

  let html = fs.readFileSync(SRC_HTML, 'utf8');

  for (const key of REQUIRED_VARS) {
    const token = '__' + key + '__';
    const safeValue = JSON.stringify(process.env[key]); // string de JS ya escapado y entre comillas
    if (!html.includes(token)) {
      console.error(`\n❌ Build cancelado: no se encontró el token ${token} en index.html.`);
      console.error('   ¿Se modificó accidentalmente la línea de SUPABASE_URL/SUPABASE_KEY?\n');
      process.exit(1);
    }
    html = html.split(token).join(safeValue);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_HTML, html, 'utf8');

  console.log('✅ Build listo: dist/index.html generado con las credenciales inyectadas.');
}

main();
