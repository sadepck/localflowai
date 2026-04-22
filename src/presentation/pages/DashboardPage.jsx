import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../infrastructure/store/authStore'
import { useStoreStore } from '../../infrastructure/store/storeStore'
import { storeRepository } from '../../domain/repositories/storeRepository'
import { salesRepository } from '../../domain/repositories/salesRepository'
import { supabase } from '../../infrastructure/config/supabase'
import { Camera, TrendingUp, DollarSign, Calendar, LogOut } from 'lucide-react'
import KPICard from '../components/KPICard'
import SalesChart from '../components/SalesChart'
import SalesList from '../components/SalesList'
import UploadReceiptModal from '../components/UploadReceiptModal'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const { currentStore, setCurrentStore } = useStoreStore()

  const [todaySales, setTodaySales] = useState([])
  const [monthSales, setMonthSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    loadStoreData()
  }, [user])

  useEffect(() => {
    if (currentStore) {
      loadSalesData()
    }
  }, [currentStore])

  const loadStoreData = async () => {
    try {
      const stores = await storeRepository.getByOwnerId(user.id)
      if (stores.length === 0) {
        navigate('/onboarding')
      } else {
        setCurrentStore(stores[0])
      }
    } catch (error) {
      console.error('Error loading store:', error)
    }
  }

  const loadSalesData = async () => {
    try {
      setLoading(true)
      const [today, month] = await Promise.all([
        salesRepository.getTodaySales(currentStore.id),
        salesRepository.getMonthSales(currentStore.id),
      ])
      setTodaySales(today)
      setMonthSales(month)
    } catch (error) {
      console.error('Error loading sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login')
  }

  const calculateTotalSales = (sales) => {
    return sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0)
  }

  const todayTotal = calculateTotalSales(todaySales)
  const monthTotal = calculateTotalSales(monthSales)
  const monthGoal = currentStore?.monthly_goal || 0
  const goalProgress = monthGoal > 0 ? (monthTotal / monthGoal) * 100 : 0

  if (loading || !currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentStore.name}
              </h1>
              <p className="text-sm text-gray-600">
                {currentStore.category} • {currentStore.city}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Ventas Hoy"
            value={`$${todayTotal.toLocaleString('es-CL')}`}
            subtitle={`${todaySales.length} transacciones`}
            icon={DollarSign}
            iconColor="text-secondary"
            bgColor="bg-secondary/10"
          />
          <KPICard
            title="Ventas del Mes"
            value={`$${monthTotal.toLocaleString('es-CL')}`}
            subtitle={`${monthSales.length} transacciones`}
            icon={Calendar}
            iconColor="text-primary"
            bgColor="bg-primary/10"
          />
          <KPICard
            title="Progreso Meta Mensual"
            value={`${goalProgress.toFixed(1)}%`}
            subtitle={`Meta: $${monthGoal.toLocaleString('es-CL')}`}
            icon={TrendingUp}
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
            progress={Math.min(goalProgress, 100)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart sales={monthSales} monthlyGoal={monthGoal} />
          <SalesList sales={todaySales} onRefresh={loadSalesData} />
        </div>
      </main>

      <button
        onClick={() => setShowUploadModal(true)}
        className="floating-button"
        aria-label="Subir foto de comprobante"
      >
        <Camera size={24} />
      </button>

      {showUploadModal && (
        <UploadReceiptModal
          storeId={currentStore.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={loadSalesData}
        />
      )}
    </div>
  )
}

export default DashboardPage
