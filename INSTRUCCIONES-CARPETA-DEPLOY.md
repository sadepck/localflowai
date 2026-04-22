# 📁 Instrucciones: Carpeta de Deploy

## 🚀 Paso 1: Crear la carpeta de deploy

Ejecuta el script que crea una copia limpia con solo los archivos necesarios:

```powershell
# Desde PowerShell en D:\localflowai
.\crear-carpeta-deploy.ps1
```

Esto creará una carpeta nueva: **`D:\localflowai-deploy`**

---

## 📦 Paso 2: Inicializar Git en la nueva carpeta

Abre PowerShell en la carpeta nueva:

```powershell
# Ir a la carpeta de deploy
cd D:\localflowai-deploy

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - LocalFlow AI"
```

---

## 🌐 Paso 3: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `localflow-ai`
3. **NO** marques "Initialize with README"
4. Click **"Create repository"**

---

## 📤 Paso 4: Subir a GitHub

GitHub te dará estos comandos, pero usa estos:

```powershell
git remote add origin https://github.com/TU-USUARIO/localflow-ai.git
git branch -M main
git push -u origin main
```

Reemplaza `TU-USUARIO` con tu usuario de GitHub.

---

## 🔗 Paso 5: Conectar Netlify con GitHub

1. Ve a https://app.netlify.com
2. Click **"Add new site"** > **"Import an existing project"**
3. Selecciona **"Deploy with GitHub"**
4. Autoriza a Netlify
5. Busca y selecciona tu repositorio `localflow-ai`
6. Deja las configuraciones por defecto
7. Click **"Deploy site"**

---

## 🔑 Paso 6: Configurar Variables de Entorno

En Netlify:

1. Ve a **Site configuration** > **Environment variables**
2. Click **"Add a variable"** y agrega estas 3:

```
Variable 1:
Key: VITE_SUPABASE_URL
Value: https://udkfaxdknokehkwwrdkv.supabase.co

Variable 2:
Key: VITE_SUPABASE_ANON_KEY
Value: (tu clave anon de Supabase)

Variable 3:
Key: VITE_OCR_API_KEY
Value: (tu clave de OCR.space)
```

3. Guarda las variables
4. Ve a **Deploys** > **Trigger deploy** > **Deploy site**

---

## ✅ Verificación

Una vez que el deploy termine (2-3 minutos):

1. Abre la URL de tu sitio: `https://tu-sitio.netlify.app`
2. Deberías ver la pantalla de login de LocalFlow AI
3. Regístrate y prueba la aplicación

---

## 🎉 ¡Listo!

Tu aplicación está en producción y accesible 24/7 desde cualquier dispositivo.

---

## 📝 Actualizaciones futuras

Para actualizar la app:

```powershell
# En D:\localflowai-deploy
git add .
git commit -m "Descripción del cambio"
git push
```

Netlify desplegará automáticamente los cambios.
