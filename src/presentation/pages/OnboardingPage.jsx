import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../infrastructure/store/authStore'
import { useStoreStore } from '../../infrastructure/store/storeStore'
import { storeRepository } from '../../domain/repositories/storeRepository'
import Stepper from '../components/Stepper'
import { Store, MapPin, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react'

const CATEGORIES = [
  'Vivero',
  'Tienda de Ropa',
  'Panadería',
  'Ferretería',
  'Minimarket',
  'Farmacia',
  'Librería',
  'Otro',
]

const CITIES = [
  'Santiago',
  'Valparaíso',
  'Concepción',
  'La Serena',
  'Antofagasta',
  'Temuco',
  'Rancagua',
  'Talca',
  'Puerto Montt',
  'Otra',
]

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
  { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
]

const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setCurrentStore } = useStoreStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    customCategory: '',
    city: '',
    customCity: '',
    monthlyGoal: '',
    paymentMethods: ['efectivo', 'transferencia'],
  })

  const steps = ['Datos Básicos', 'Ubicación y Metas', 'Métodos de Pago']

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const togglePaymentMethod = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const storeData = {
        owner_id: user.id,
        name: formData.name,
        category: formData.category === 'Otro' ? formData.customCategory : formData.category,
        city: formData.city === 'Otra' ? formData.customCity : formData.city,
        monthly_goal: parseFloat(formData.monthlyGoal) || 0,
        settings: {
          payment_methods: formData.paymentMethods,
          currency: 'CLP',
          timezone: 'America/Santiago',
          notifications_enabled: true,
        },
      }

      const newStore = await storeRepository.create(storeData)
      setCurrentStore(newStore)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating store:', error)
      alert('Error al crear la tienda. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.category && 
               (formData.category !== 'Otro' || formData.customCategory)
      case 1:
        return formData.city && (formData.city !== 'Otra' || formData.customCity)
      case 2:
        return formData.paymentMethods.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configura tu Tienda
          </h1>
          <p className="text-gray-600">
            Solo tomará unos minutos empezar a gestionar tus ventas
          </p>
        </div>

        <div className="card">
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary mb-6">
                  <Store size={24} />
                  <h2 className="text-xl font-semibold">Datos Básicos</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de tu Negocio *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Ej: Vivero Las Flores"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="">Selecciona una categoría</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category === 'Otro' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especifica tu categoría *
                    </label>
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) =>
                        handleInputChange('customCategory', e.target.value)
                      }
                      className="input-field"
                      placeholder="Ej: Peluquería"
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary mb-6">
                  <MapPin size={24} />
                  <h2 className="text-xl font-semibold">Ubicación y Metas</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.city === 'Otra' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especifica tu ciudad *
                    </label>
                    <input
                      type="text"
                      value={formData.customCity}
                      onChange={(e) =>
                        handleInputChange('customCity', e.target.value)
                      }
                      className="input-field"
                      placeholder="Ej: Chillán"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Mensual de Ventas (CLP)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyGoal}
                    onChange={(e) =>
                      handleInputChange('monthlyGoal', e.target.value)
                    }
                    className="input-field"
                    placeholder="Ej: 1000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Opcional - Te ayudará a visualizar tu progreso
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary mb-6">
                  <CreditCard size={24} />
                  <h2 className="text-xl font-semibold">Métodos de Pago</h2>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  Selecciona los métodos de pago que aceptas en tu negocio
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => togglePaymentMethod(method.value)}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        formData.paymentMethods.includes(method.value)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.paymentMethods.includes(method.value)
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.paymentMethods.includes(method.value) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {method.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="btn-outline flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              Atrás
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn-primary flex items-center gap-2"
              >
                Siguiente
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
                className="btn-primary"
              >
                {loading ? 'Creando...' : 'Finalizar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
