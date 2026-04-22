# ✅ Checklist de Archivos para Deploy

## 📦 Archivos que DEBEN estar en tu repositorio de GitHub:

### 📁 Raíz del proyecto
```
✅ package.json
✅ package-lock.json
✅ vite.config.js
✅ tailwind.config.js
✅ postcss.config.js
✅ eslint.config.js
✅ index.html
✅ netlify.toml
✅ .gitignore
✅ .env.example (NO .env)
✅ README.md
✅ SETUP.md
✅ ARCHITECTURE.md
✅ DEPLOY.md
```

### 📁 Carpeta src/
```
✅ src/main.jsx
✅ src/index.css
✅ src/App.jsx
✅ src/infrastructure/config/supabase.js
✅ src/infrastructure/store/authStore.js
✅ src/infrastructure/store/storeStore.js
✅ src/domain/repositories/storeRepository.js
✅ src/domain/repositories/salesRepository.js
✅ src/domain/services/aiService.js
✅ src/presentation/components/Stepper.jsx
✅ src/presentation/components/KPICard.jsx
✅ src/presentation/components/SalesChart.jsx
✅ src/presentation/components/SalesList.jsx
✅ src/presentation/components/UploadReceiptModal.jsx
✅ src/presentation/pages/LoginPage.jsx
✅ src/presentation/pages/OnboardingPage.jsx
✅ src/presentation/pages/DashboardPage.jsx
✅ src/presentation/pages/TestConnectionPage.jsx
```

### 📁 Carpeta supabase/
```
✅ supabase/schema.sql
✅ supabase/functions/extract-receipt-data/index.ts (opcional, no usado actualmente)
```

---

## ❌ Archivos que NO DEBEN subirse (ya están en .gitignore):

```
❌ .env (contiene tus claves secretas)
❌ node_modules/ (dependencias, se instalan automáticamente)
❌ dist/ (build generado, se crea al desplegar)
❌ .DS_Store
❌ *.log
❌ .vscode/
```

---

## 🔑 Variables de Entorno para configurar en Netlify:

Después de subir a GitHub y conectar con Netlify, debes agregar estas 3 variables en:
**Site configuration > Environment variables**

```
VITE_SUPABASE_URL = https://udkfaxdknokehkwwrdkv.supabase.co
VITE_SUPABASE_ANON_KEY = (tu clave anon de Supabase)
VITE_OCR_API_KEY = (tu clave de OCR.space)
```

---

## 📋 Comandos para subir todo a GitHub:

### Paso 1: Verificar el estado
```bash
git status
```

Deberías ver los archivos modificados.

### Paso 2: Agregar todos los archivos
```bash
git add .
```

### Paso 3: Hacer commit
```bash
git commit -m "Fix: Ready for Netlify deployment"
```

### Paso 4: Push a GitHub
```bash
git push
```

---

## ✅ Verificación Final

Antes de hacer push, verifica que:

- [ ] El archivo `index.html` NO tiene Eruda
- [ ] El archivo `.env` NO está en el repositorio (usa `git status` para verificar)
- [ ] Todos los archivos del `src/` están incluidos
- [ ] El archivo `netlify.toml` existe en la raíz
- [ ] Las 3 variables de entorno están listas para configurar en Netlify

---

## 🚀 Después del Push

1. Netlify detectará el cambio automáticamente
2. Comenzará el build (toma 2-3 minutos)
3. Si falta configurar las variables de entorno, agrégalas en Netlify
4. Haz un **redeploy** después de agregar las variables

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en: `https://tu-sitio.netlify.app`
