import { useState, useRef } from 'react'
import { X, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../infrastructure/store/authStore'
import { salesRepository } from '../../domain/repositories/salesRepository'
import { aiService } from '../../domain/services/aiService'

const UploadReceiptModal = ({ storeId, onClose, onSuccess }) => {
  const { user } = useAuthStore()
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('upload')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setError('Por favor selecciona una imagen válida')
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleExtractData = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)
    setStep('processing')

    try {
      const base64Image = await convertToBase64(selectedFile)
      const data = await aiService.extractReceiptData(base64Image)
      
      setExtractedData(data)
      setStep('review')
    } catch (err) {
      console.error('Error extracting data:', err)
      setError('Error al procesar la imagen. Por favor intenta de nuevo.')
      setStep('upload')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSale = async () => {
    if (!extractedData) return

    setLoading(true)
    setError(null)

    try {
      const imageUrl = await salesRepository.uploadReceiptImage(
        selectedFile,
        user.id,
        storeId
      )

      await salesRepository.create({
        store_id: storeId,
        amount: extractedData.amount,
        payment_method: extractedData.paymentMethod,
        image_url: imageUrl,
        raw_ai_data: extractedData.rawData,
      })

      setStep('success')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Error saving sale:', err)
      setError('Error al guardar la venta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Registrar Venta con IA
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Sube una foto del comprobante o transferencia y la IA extraerá los datos automáticamente
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!preview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors"
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600 font-medium">
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG o WEBP
                  </p>
                </button>
              ) : (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg max-h-64 object-contain bg-gray-50"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-outline w-full"
                  >
                    Cambiar imagen
                  </button>
                  <button
                    onClick={handleExtractData}
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    Extraer datos con IA
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader className="animate-spin mx-auto text-primary mb-4" size={48} />
              <p className="text-gray-900 font-semibold mb-2">
                Procesando imagen...
              </p>
              <p className="text-sm text-gray-600">
                La IA está extrayendo los datos del comprobante
              </p>
            </div>
          )}

          {step === 'review' && extractedData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <CheckCircle size={20} />
                  Datos extraídos correctamente
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto
                  </label>
                  <input
                    type="number"
                    value={extractedData.amount}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, amount: parseFloat(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={extractedData.paymentMethod}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, paymentMethod: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta_debito">Tarjeta de Débito</option>
                    <option value="tarjeta_credito">Tarjeta de Crédito</option>
                  </select>
                </div>

                {extractedData.items && extractedData.items.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items detectados
                    </label>
                    <ul className="bg-gray-50 rounded-lg p-3 space-y-1">
                      {extractedData.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Confianza del análisis: {(extractedData.confidence * 100).toFixed(0)}%
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('upload')
                    setExtractedData(null)
                  }}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSale}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Guardando...' : 'Guardar Venta'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-secondary mb-4" size={64} />
              <p className="text-gray-900 font-semibold text-lg mb-2">
                ¡Venta registrada!
              </p>
              <p className="text-sm text-gray-600">
                Los datos se han guardado correctamente
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadReceiptModal
