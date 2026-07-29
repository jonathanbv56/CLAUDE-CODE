// ════════════════════════════════════════════════════════════════
// config.js — Credenciales de Supabase para MisDatosHN
// ════════════════════════════════════════════════════════════════
// ESTE ARCHIVO NO DEBE SUBIRSE A UN REPOSITORIO PÚBLICO (git, GitHub, etc.)
// Agregalo a tu .gitignore (ver archivo .gitignore incluido).
//
// Nota honesta: la SUPABASE_KEY de abajo es la clave "publishable"
// (equivalente a la antigua "anon key"). Está DISEÑADA para vivir en el
// navegador — Supabase la considera pública a propósito. La seguridad real
// de tus datos la da el Row Level Security (RLS) que ya activaste en la
// base de datos, no el hecho de ocultar esta clave. Aun así, separarla del
// código en este archivo es buena práctica: te permite tener distintos
// valores para desarrollo/producción, rotarla sin tocar index.html, y
// evitar subirla sin querer a un repo público.
// ════════════════════════════════════════════════════════════════
window.APP_CONFIG = {
  SUPABASE_URL: 'https://fcpunepukrwpbjbmfuzv.supabase.co',
  SUPABASE_KEY: 'sb_publishable_GvK287oBw7cqw3GT3H4K8g_w5eHkG0q'
};
