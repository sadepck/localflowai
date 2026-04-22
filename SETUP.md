# 📖 Guía de Configuración Paso a Paso

## 1️⃣ Configurar Supabase

### Crear proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Completa:
   - **Name**: LocalFlow AI
   - **Database Password**: (guarda esto en lugar seguro)
   - **Region**: South America (más cercano a Chile)
4. Click "Create new project"

### Configurar Base de Datos
1. Una vez creado el proyecto, ve a **SQL Editor** (icono en sidebar)
2. Click en "New query"
3. Copia todo el contenido de `supabase/schema.sql`
4. Pega en el editor y click "Run"
5. Deberías ver: "Success. No rows returned"

### Obtener credenciales
1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL** → Esto es tu `VITE_SUPABASE_URL`
   - **anon public** key → Esto es tu `VITE_SUPABASE_ANON_KEY`

### Configurar Storage
1. Ve a **Storage** en el sidebar
2. Deberías ver el bucket "receipts" creado automáticamente por el SQL
3. Si no existe, créalo manualmente con el nombre "receipts" y marca como privado

## 2️⃣ Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Click en "Get API key"
4. Click en "Create API key in new project"
5. Copia la API key → Esto es tu `VITE_GEMINI_API_KEY`

⚠️ **Importante**: Esta key tiene límites gratuitos. Para producción considera implementar rate limiting.

## 3️⃣ Configurar el Proyecto

### Instalar dependencias
```bash
cd localflowai
npm install
```

### Crear archivo .env
Crea un archivo `.env` en la raíz con:

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_GEMINI_API_KEY=tu_gemini_api_key_aqui
```

## 4️⃣ Ejecutar la Aplicación

```bash
npm run dev
```

Abre tu navegador en `http://localhost:3000`

## 5️⃣ Primer Uso

### Crear cuenta
1. Click en "¿No tienes cuenta? Regístrate"
2. Ingresa email y contraseña
3. **Importante**: Ve a tu email y confirma la cuenta (revisa spam)
4. Vuelve a la app e inicia sesión

### Onboarding
1. **Paso 1**: Nombre de tu negocio y categoría
2. **Paso 2**: Ciudad y meta mensual (ej: 1000000 CLP)
3. **Paso 3**: Selecciona métodos de pago que aceptas
4. Click "Finalizar"

### Registrar primera venta
1. Click en el botón flotante violeta (cámara)
2. Sube una foto de un comprobante o transferencia
3. La IA procesará la imagen (toma ~5 segundos)
4. Revisa los datos extraídos
5. Ajusta si es necesario
6. Click "Guardar Venta"

¡Listo! 🎉

## 🐛 Solución de Problemas

### "Missing Supabase environment variables"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo

### "Error creating store"
- Verifica que ejecutaste el script SQL completo
- Revisa que las RLS policies estén activas
- Confirma que tu email esté verificado en Supabase

### "Error extracting receipt data"
- Verifica tu API key de Gemini
- Asegúrate de tener cuota disponible
- La imagen debe ser clara y legible
- Formatos soportados: JPG, PNG, WEBP

### La IA no extrae bien los datos
- Asegúrate de que la foto sea nítida
- El comprobante debe estar bien iluminado
- Evita reflejos o sombras
- Puedes editar los datos manualmente antes de guardar

## 📊 Datos de Prueba

Si quieres probar sin fotos reales, puedes insertar datos manualmente en Supabase:

1. Ve a **Table Editor** > **sales**
2. Click "Insert row"
3. Completa:
   - store_id: (copia el ID de tu tienda desde la tabla stores)
   - amount: 15000
   - payment_method: transferencia
   - created_at: (fecha actual)
4. Click "Save"

## 🚀 Deploy a Producción

### Opción 1: Vercel (Recomendado)
1. Push tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Import repository
4. Agrega las variables de entorno
5. Deploy

### Opción 2: Netlify
1. Push a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. New site from Git
4. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Agrega environment variables
6. Deploy

⚠️ **Seguridad**: En producción, considera mover la lógica de IA a Supabase Edge Functions para proteger tu API key.

## 📞 ¿Necesitas ayuda?

Abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Screenshots si es posible
- Console logs (F12 en el navegador)
