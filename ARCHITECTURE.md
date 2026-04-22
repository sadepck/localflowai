# 🏗️ Arquitectura del Proyecto

## Clean Architecture

LocalFlow AI sigue los principios de Clean Architecture, separando las responsabilidades en capas bien definidas:

```
┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                  │
│  (UI Components, Pages, User Interface)     │
│                                             │
│  • LoginPage                                │
│  • OnboardingPage (3-step stepper)          │
│  • DashboardPage                            │
│  • Components (KPICard, SalesChart, etc)    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         DOMAIN LAYER                        │
│  (Business Logic, Use Cases)                │
│                                             │
│  • Repositories (storeRepository,           │
│    salesRepository)                         │
│  • Services (aiService)                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      INFRASTRUCTURE LAYER                   │
│  (External Services, Config, State)         │
│                                             │
│  • Supabase Config                          │
│  • Zustand Stores (authStore, storeStore)   │
│  • Gemini API Integration                   │
└─────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Autenticación
```
User Input → Supabase Auth → authStore → App Routes
```

### 2. Onboarding
```
Form (3 steps) → storeRepository.create() → Supabase DB → storeStore → Redirect to Dashboard
```

### 3. Registro de Venta con IA
```
Photo Upload → aiService.extractReceiptData() → Gemini API
                    ↓
              Extract Data (amount, payment_method)
                    ↓
              salesRepository.uploadReceiptImage() → Supabase Storage
                    ↓
              salesRepository.create() → Supabase DB
                    ↓
              Dashboard Refresh
```

### 4. Visualización de Dashboard
```
DashboardPage → salesRepository.getTodaySales()
             → salesRepository.getMonthSales()
             → State Update → Re-render Components
```

## Estructura de Archivos Detallada

```
localflowai/
│
├── src/
│   ├── presentation/              # 🎨 Capa de Presentación
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      # Login/Registro
│   │   │   ├── OnboardingPage.jsx # Stepper 3 pasos
│   │   │   └── DashboardPage.jsx  # Dashboard principal
│   │   └── components/
│   │       ├── Stepper.jsx        # Componente stepper reutilizable
│   │       ├── KPICard.jsx        # Tarjeta de KPI
│   │       ├── SalesChart.jsx     # Gráfico Recharts
│   │       ├── SalesList.jsx      # Lista de ventas
│   │       └── UploadReceiptModal.jsx # Modal de upload + IA
│   │
│   ├── domain/                    # 💼 Capa de Dominio
│   │   ├── repositories/
│   │   │   ├── storeRepository.js # CRUD de tiendas
│   │   │   └── salesRepository.js # CRUD de ventas + upload
│   │   └── services/
│   │       └── aiService.js       # Integración Gemini API
│   │
│   ├── infrastructure/            # 🔧 Capa de Infraestructura
│   │   ├── config/
│   │   │   └── supabase.js        # Cliente Supabase
│   │   └── store/
│   │       ├── authStore.js       # Estado de autenticación
│   │       └── storeStore.js      # Estado de tienda actual
│   │
│   ├── App.jsx                    # Router y rutas protegidas
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Estilos Tailwind + custom
│
├── supabase/
│   ├── schema.sql                 # Schema completo con RLS
│   └── functions/
│       └── extract-receipt-data/  # Edge Function (opcional)
│           └── index.ts
│
├── package.json                   # Dependencies
├── vite.config.js                 # Vite config
├── tailwind.config.js             # Tailwind config (colores custom)
├── .env.example                   # Template de variables
├── README.md                      # Documentación general
├── SETUP.md                       # Guía paso a paso
└── ARCHITECTURE.md                # Este archivo
```

## Tecnologías y Justificación

### Frontend
- **React 18**: Librería UI moderna y performante
- **Vite**: Build tool ultra rápido, HMR excelente
- **Tailwind CSS**: Utility-first CSS, desarrollo rápido
- **Lucide React**: Iconos consistentes y ligeros
- **Recharts**: Gráficos declarativos basados en React

### Backend/Database
- **Supabase**: 
  - PostgreSQL managed (escalable)
  - Auth out-of-the-box
  - Storage integrado
  - RLS para seguridad
  - Real-time capabilities (futuro)

### IA
- **Gemini 1.5 Flash**:
  - Modelo multimodal (texto + imagen)
  - Respuestas rápidas (~2-5s)
  - API gratuita con cuota generosa
  - Excelente para OCR en español

### State Management
- **Zustand**: 
  - Más simple que Redux
  - Menos boilerplate
  - TypeScript friendly
  - Perfect para apps pequeñas/medianas

### Routing
- **React Router v6**:
  - Estándar de facto
  - Rutas protegidas fáciles
  - Navegación declarativa

## Patrones de Diseño Utilizados

### 1. Repository Pattern
Abstrae el acceso a datos, facilita testing y cambios de backend.

```javascript
// domain/repositories/salesRepository.js
export const salesRepository = {
  async create(saleData) { /* ... */ },
  async getTodaySales(storeId) { /* ... */ },
  // ...
}
```

### 2. Service Pattern
Encapsula lógica de negocio compleja (ej: IA).

```javascript
// domain/services/aiService.js
export const aiService = {
  async extractReceiptData(imageBase64) { /* ... */ },
  async analyzeSalesTrends(salesData) { /* ... */ }
}
```

### 3. Component Composition
Componentes pequeños y reutilizables.

```jsx
<KPICard 
  title="Ventas Hoy"
  value={todayTotal}
  icon={DollarSign}
  iconColor="text-secondary"
/>
```

### 4. Custom Hooks (implícito en Zustand)
Estado global con API de hooks.

```javascript
const { user, setUser } = useAuthStore()
const { currentStore } = useStoreStore()
```

## Seguridad

### Row Level Security (RLS)
Todas las tablas tienen políticas RLS que aseguran que:
- Los usuarios solo ven sus propias tiendas
- Los usuarios solo ven ventas de sus tiendas
- Las imágenes en Storage son privadas por usuario

### Autenticación
- JWT tokens manejados por Supabase
- Session management automático
- Email verification

### Variables de Entorno
- API keys nunca en el código
- `.env` en `.gitignore`
- Variables prefijadas con `VITE_` para frontend

## Escalabilidad

### Actual (MVP)
- 1 tienda por usuario
- Procesamiento de IA en cliente
- Sin límite de ventas (Supabase scale)

### Futuro
- **Multi-tienda**: Ya preparado en el schema
- **Edge Functions**: Mover IA al backend (más seguro)
- **Caching**: React Query para optimizar fetches
- **Real-time**: Supabase subscriptions para updates live
- **Analytics**: Agregar tabla de analytics_events
- **Webhooks**: Notificaciones a sistemas externos

## Performance

### Optimizaciones Implementadas
- Lazy loading de rutas (Router)
- Componentes memoizados donde necesario
- Queries optimizadas con índices DB
- Compresión de imágenes antes de upload (futuro)

### Métricas Target
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Testing (Futuro)

```
tests/
├── unit/
│   ├── repositories/
│   ├── services/
│   └── components/
├── integration/
│   └── pages/
└── e2e/
    └── user-flows/
```

Herramientas sugeridas:
- **Vitest**: Tests unitarios
- **Testing Library**: Tests de componentes
- **Playwright**: E2E

## CI/CD (Futuro)

```yaml
# .github/workflows/deploy.yml
- Run tests
- Build project
- Deploy to Vercel/Netlify
- Run Supabase migrations
- Deploy Edge Functions
```

## Monitoreo (Futuro)

- **Sentry**: Error tracking
- **Vercel Analytics**: Web vitals
- **Supabase Dashboard**: DB performance
- **Google Analytics**: User behavior

---

**Principios Seguidos:**
- ✅ Separation of Concerns
- ✅ Single Responsibility
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID principles
- ✅ Mobile-first design
- ✅ Progressive enhancement
