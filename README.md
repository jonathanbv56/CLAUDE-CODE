# MisDatosHN

Control de finanzas personales y de negocio. Sitio estático (HTML + JS,
sin framework) que usa Supabase como backend.

## Variables de entorno que hay que crear en Vercel

En tu proyecto de Vercel: **Settings → Environment Variables** → agregá
estas dos, marcadas para **Production**, **Preview** y **Development**:

| Nombre | Valor | Dónde lo encontrás |
|---|---|---|
| `SUPABASE_URL` | `https://fcpunepukrwpbjbmfuzv.supabase.co` | Supabase Dashboard → tu proyecto → Project Settings → API → Project URL |
| `SUPABASE_KEY` | `sb_publishable_GvK287oBw7cqw3GT3H4K8g_w5eHkG0q` | Supabase Dashboard → tu proyecto → Project Settings → API → Publishable key |

No hace falta ninguna otra variable. `config.js` ya no existe en el
proyecto — las credenciales se inyectan directo en `index.html` durante
el build, a partir de estas dos variables.

## Cómo desplegar

1. Subí esta carpeta a un repositorio de GitHub/GitLab/Bitbucket (o usá
   `vercel` CLI directo desde acá).
2. En Vercel: **Add New → Project** → importá el repo.
3. Framework Preset: dejalo en **Other** (Vercel va a usar
   `vercel.json`, que ya trae el comando de build y la carpeta de
   salida configurados).
4. Antes de darle **Deploy**, agregá las dos variables de entorno de la
   tabla de arriba (Settings → Environment Variables). Si ya
   desplegaste sin haberlas puesto, agregalas y volvé a desplegar
   ("Redeploy") — el build las necesita presentes desde el principio.
5. Deploy. Cada vez que Vercel construye el proyecto, corre
   `npm run build`, que genera `dist/index.html` con las credenciales
   ya inyectadas, y esa es la carpeta que Vercel publica.

Si falta alguna de las dos variables, **el build falla** con un mensaje
claro en los logs de Vercel (a propósito: mejor que quede un deploy
roto y visible en los logs, a que se publique una app silenciosamente
rota).

## Cómo probarlo en tu computadora (opcional)

```bash
cp .env.example .env
# editá .env con tus valores reales de Supabase
npm run build
npx serve dist
```

## Qué cambió respecto a la versión con `config.js`

- Ya no existe `config.js` ni `config.example.js` en el proyecto.
- `index.html` (el que está en este repo) tiene dos tokens de
  placeholder (`__SUPABASE_URL__` y `__SUPABASE_KEY__`) en vez de un
  valor real o una carga externa — es seguro subir este archivo a un
  repo público tal cual está.
- `scripts/build.js` es lo único que sabe reemplazar esos tokens, y
  solo lo hace con lo que le pasan las Environment Variables (de
  Vercel, o de tu `.env` local).
- El resultado final con los valores reales queda únicamente en
  `dist/`, que nunca se sube a git (está en `.gitignore`) — Vercel lo
  regenera en cada deploy.

## Nota sobre seguridad de la clave

`SUPABASE_KEY` es la clave **publishable** de Supabase (antes llamada
"anon key"). Está diseñada para viajar al navegador — no es un secreto
que haya que ocultar del cliente final. Igual la manejamos por
Environment Variables porque así podés rotarla sin tocar código, usar
un proyecto de Supabase distinto en Preview vs Production si algún día
lo necesitás, y nunca corres el riesgo de subirla sin querer a un repo
público. La seguridad real de los datos la da el Row Level Security
(RLS) ya activado en la base de datos.
