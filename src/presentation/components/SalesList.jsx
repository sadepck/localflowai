import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { RefreshCw, Banknote, CreditCard, Smartphone } from 'lucide-react'

const paymentMethodIcons = {
  efectivo: Banknote,
  transferencia: Smartphone,
  tarjeta_debito: CreditCard,
  tarjeta_credito: CreditCard,
}

const paymentMethodLabels = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta_debito: 'T. Débito',
  tarjeta_credito: 'T. Crédito',
}

const SalesList = ({ sales, onRefresh }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Ventas de Hoy
        </h3>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Actualizar"
        >
          <RefreshCw size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {sales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay ventas registradas hoy</p>
            <p className="text-sm mt-2">Usa el botón flotante para agregar una venta</p>
          </div>
        ) : (
          sales.map((sale) => {
            const Icon = paymentMethodIcons[sale.payment_method] || Banknote
            return (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      ${parseFloat(sale.amount).toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {paymentMethodLabels[sale.payment_method] || sale.payment_method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {format(new Date(sale.created_at), "HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SalesList
