# 🏪 LocalFlow AI

**Gestión financiera inteligente con IA para pequeños comercios en Chile**

LocalFlow AI es un Micro-SaaS que permite a dueños de negocios registrar ventas mediante fotografías de comprobantes o transferencias. La inteligencia artificial (Gemini 1.5 Flash) extrae automáticamente el monto y método de pago.

## ✨ Características

- 📸 **OCR Inteligente**: Saca una foto al comprobante y la IA extrae los datos automáticamente
- 📊 **Dashboard en Tiempo Real**: Visualiza tus ventas del día y del mes
- 🎯 **Metas Mensuales**: Establece objetivos y visualiza tu progreso
- 📈 **Gráficos de Ventas**: Compara tus ventas vs tu meta mensual
- 🔐 **Autenticación Segura**: Powered by Supabase Auth
- 📱 **100% Responsive**: Optimizado para móviles y desktop

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage
- **IA**: Google Gemini 1.5 Flash API
- **Gráficos**: Recharts
- **State Management**: Zustand
- **Router**: React Router v6

## 🎨 Paleta de Colores

- **Primario**: `#6C5CE7` (Violeta)
- **Secundario**: `#00B894` (Verde agua)

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- API Key de [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd localflowai
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor y ejecuta el script `supabase/schema.sql`
3. Copia tu Project URL y Anon Key

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

### 5. (Opcional) Desplegar Edge Function

Si prefieres usar Supabase Edge Functions en lugar del cliente:

```bash
# Instalar Supabase CLI
npm i supabase --save-dev

# Login
npx supabase login

# Link tu proyecto
npx supabase link --project-ref tu-project-ref

# Desplegar la función
npx supabase functions deploy extract-receipt-data --no-verify-jwt

# Configurar el secret
npx supabase secrets set GEMINI_API_KEY=tu_api_key
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
localflowai/
├── src/
│   ├── domain/              # Lógica de negocio
│   │   ├── repositories/    # Acceso a datos
│   │   └── services/        # Servicios (IA, etc.)
│   ├── infrastructure/      # Configuración externa
│   │   ├── config/          # Supabase config
│   │   └── store/           # Estado global (Zustand)
│   ├── presentation/        # Componentes UI
│   │   ├── components/      # Componentes reutilizables
│   │   └── pages/           # Páginas de la app
│   ├── App.jsx              # Router principal
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globales
├── supabase/
│   ├── schema.sql           # Schema de base de datos
│   └── functions/           # Edge Functions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🗄️ Base de Datos

### Tablas principales

**stores**
- `id`: UUID (PK)
- `owner_id`: UUID (FK a auth.users)
- `name`: VARCHAR(255)
- `category`: VARCHAR(100)
- `city`: VARCHAR(100)
- `monthly_goal`: DECIMAL(12,2)
- `settings`: JSONB

**sales**
- `id`: UUID (PK)
- `store_id`: UUID (FK a stores)
- `amount`: DECIMAL(12,2)
- `payment_method`: VARCHAR(50)
- `raw_ai_data`: JSONB
- `image_url`: TEXT
- `created_at`: TIMESTAMP

## 🤖 Integración con IA

LocalFlow AI usa **Gemini 1.5 Flash** para:

1. **OCR de comprobantes**: Extrae monto, método de pago e items
2. **Análisis de tendencias**: Genera insights sobre las ventas

El prompt está optimizado para comprobantes chilenos (formato CLP, transferencias bancarias locales, etc.)

## 📱 Flujo de Usuario

1. **Registro/Login**: Autenticación via Supabase
2. **Onboarding**: 3 pasos para configurar la tienda
   - Datos básicos (nombre, categoría)
   - Ubicación y meta mensual
   - Métodos de pago aceptados
3. **Dashboard**: Visualización de KPIs y ventas
4. **Registro de venta**: 
   - Click en botón flotante de cámara
   - Subir foto del comprobante
   - IA extrae datos automáticamente
   - Revisar y confirmar
   - ¡Listo!

## 🎯 Casos de Uso

- **Viveros**: Control de ventas de plantas y servicios
- **Tiendas de ropa**: Tracking de ventas por método de pago
- **Panaderías**: Registro rápido de ventas diarias
- **Minimarkets**: Control de caja simplificado
- Cualquier pequeño comercio que quiera digitalizar sus ventas

## 🔒 Seguridad

- Row Level Security (RLS) en todas las tablas
- Storage policies para imágenes privadas
- Autenticación JWT via Supabase
- Validación de datos en frontend y backend

## 🚧 Próximas Features

- [ ] Exportar reportes en PDF
- [ ] Notificaciones push
- [ ] Multi-tienda por usuario
- [ ] Dashboard de análisis predictivo
- [ ] Integración con SII (Servicio de Impuestos Internos)
- [ ] App móvil nativa

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, abre un issue en GitHub o contacta a [tu-email]

---

Hecho con ❤️ para pequeños comercios chilenos 🇨🇱
