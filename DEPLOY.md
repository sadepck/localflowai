# 🚀 Guía de Despliegue en Netlify

## Requisitos Previos
- Cuenta en [Netlify](https://netlify.com)
- Tu proyecto en GitHub (opcional, también puedes arrastrar y soltar)
- Variables de entorno configuradas

---

## Opción 1: Despliegue desde GitHub (Recomendado)

### 1. Subir el proyecto a GitHub

Si aún no lo has hecho:

```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - LocalFlow AI"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/localflow-ai.git
git branch -M main
git push -u origin main
```

### 2. Conectar con Netlify

1. Ve a [Netlify](https://app.netlify.com/)
2. Click en **"Add new site"** > **"Import an existing project"**
3. Selecciona **GitHub** y autoriza
4. Busca tu repositorio **localflow-ai**
5. Configura el build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3. Configurar Variables de Entorno

En la configuración del sitio:

1. Ve a **Site settings** > **Environment variables**
2. Click en **"Add a variable"**
3. Agrega estas 3 variables:

```
VITE_SUPABASE_URL = https://udkfaxdknokehkwwrdkv.supabase.co
VITE_SUPABASE_ANON_KEY = tu_clave_anon_de_supabase
VITE_OCR_API_KEY = tu_clave_ocr_space
```

⚠️ **Importante**: Las variables DEBEN empezar con `VITE_`

### 4. Desplegar

Click en **"Deploy site"**

Netlify automáticamente:
- Instalará las dependencias
- Ejecutará el build
- Desplegará tu aplicación

Tu app estará en: `https://nombre-aleatorio.netlify.app`

---

## Opción 2: Despliegue Manual (Drag & Drop)

### 1. Construir el proyecto localmente

```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados.

### 2. Desplegar en Netlify

1. Ve a [Netlify](https://app.netlify.com/)
2. Arrastra la carpeta **`dist`** a la zona de "drop"
3. Espera a que termine de subir

### 3. Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Con el despliegue manual, las variables de entorno están "quemadas" en el build. Para que funcione:

**Antes de hacer `npm run build`**, asegúrate de que tu archivo `.env` tenga las variables correctas con los valores de producción.

---

## 🔧 Configuración Post-Despliegue

### Cambiar el nombre del sitio

1. Ve a **Site settings** > **Site details**
2. Click en **"Change site name"**
3. Elige algo como: `localflow-ai-tuempresa`

Tu nueva URL será: `https://localflow-ai-tuempresa.netlify.app`

### Dominio personalizado (Opcional)

Si tienes un dominio propio:

1. Ve a **Domain settings** > **Add custom domain**
2. Sigue las instrucciones para configurar DNS

---

## 🐛 Solución de Problemas

### Error: "Missing environment variables"

- Verifica que las variables en Netlify empiecen con `VITE_`
- Redeploy después de agregar las variables
- En el despliegue manual, reconstruye con `npm run build`

### Error: "Page not found" al navegar

- Verifica que el archivo `netlify.toml` esté en la raíz
- Debe contener las reglas de redirección

### La app no carga

- Abre la consola del navegador (F12)
- Verifica que las variables de entorno se hayan cargado
- Revisa los logs de build en Netlify

---

## 📝 Actualizaciones Futuras

### Con GitHub conectado:

Simplemente haz push a tu repositorio:

```bash
git add .
git commit -m "Nuevas mejoras"
git push
```

Netlify detectará el cambio y desplegará automáticamente.

### Con despliegue manual:

1. Haz cambios en el código
2. `npm run build`
3. Arrastra la nueva carpeta `dist/` a Netlify

---

## ✅ Checklist de Despliegue

- [ ] Proyecto construye sin errores (`npm run build`)
- [ ] Variables de entorno configuradas en Netlify
- [ ] `netlify.toml` en la raíz del proyecto
- [ ] Base de datos Supabase configurada (schema.sql ejecutado)
- [ ] Storage bucket "receipts" creado en Supabase
- [ ] API key de OCR.space válida
- [ ] Prueba en producción con una venta real

---

## 🎉 Tu App en Producción

Una vez desplegada, tu app estará disponible 24/7 en:
- URL de Netlify: `https://tu-sitio.netlify.app`
- O tu dominio personalizado

**Accesible desde cualquier dispositivo con internet** 📱💻

---

¿Necesitas ayuda? Revisa los logs de build en Netlify o abre la consola del navegador para ver errores específicos.
