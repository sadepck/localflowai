# 🚀 Despliegue Rápido a Netlify

## Método más simple: Drag & Drop

### Paso 1: Construir el proyecto

Ejecuta en la terminal:
```bash
npm run build
```

Esto creará una carpeta `dist/` con tu aplicación lista.

### Paso 2: Desplegar en Netlify

1. Ve a https://app.netlify.com
2. Si no tienes cuenta, regístrate (es gratis)
3. Haz clic en **"Add new site"** > **"Deploy manually"**
4. **Arrastra la carpeta `dist`** a la zona de drop
5. Espera 1-2 minutos

¡Listo! Tu app estará en línea en: `https://nombre-aleatorio.netlify.app`

### Paso 3: Configurar Variables de Entorno

**MUY IMPORTANTE**: Para que la app funcione en producción:

1. En Netlify, ve a tu sitio
2. Click en **"Site configuration"** > **"Environment variables"**
3. Click en **"Add a variable"** y agrega estas 3:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://udkfaxdknokehkwwrdkv.supabase.co`

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: (tu clave anon de Supabase)

**Variable 3:**
- Key: `VITE_OCR_API_KEY`
- Value: (tu clave de OCR.space)

4. Click en **"Save"**
5. Ve a **"Deploys"** > **"Trigger deploy"** > **"Deploy site"**

### Paso 4: Cambiar el nombre (Opcional)

1. Ve a **"Site configuration"** > **"Site details"**
2. Click en **"Change site name"**
3. Elige un nombre: `localflow-ai-tuempresa`

Tu URL será: `https://localflow-ai-tuempresa.netlify.app`

---

## ⚠️ Importante

- Las variables de entorno **DEBEN empezar con** `VITE_`
- Después de agregar las variables, **debes hacer un redeploy**
- La primera vez que ingreses, deberás crear una cuenta nueva (las credenciales locales no se copian)

---

## ✅ Listo

Tu app está en producción y accesible desde cualquier dispositivo 24/7 🎉
