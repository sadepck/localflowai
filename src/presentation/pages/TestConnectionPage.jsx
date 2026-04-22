import { useState } from 'react'
import { supabase } from '../../infrastructure/config/supabase'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const TestConnectionPage = () => {
  const [results, setResults] = useState([])
  const [testing, setTesting] = useState(false)

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, { test, status, message }])
  }

  const testConnection = async () => {
    setResults([])
    setTesting(true)

    try {
      // Test 1: Verificar variables de entorno
      addResult(
        'Variables de Entorno',
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY ? 'success' : 'error',
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY 
          ? `URL: ${import.meta.env.VITE_SUPABASE_URL}` 
          : 'Faltan variables de entorno'
      )

      // Test 2: Verificar tabla stores
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('count')
        .limit(1)

      addResult(
        'Tabla stores',
        storesError ? 'error' : 'success',
        storesError ? storesError.message : 'Tabla accesible'
      )

      // Test 3: Verificar tabla sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('count')
        .limit(1)

      addResult(
        'Tabla sales',
        salesError ? 'error' : 'success',
        salesError ? salesError.message : 'Tabla accesible'
      )

      // Test 4: Verificar storage buckets
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets()

      addResult(
        'Storage (Buckets)',
        bucketsError ? 'error' : 'success',
        bucketsError 
          ? bucketsError.message 
          : `Buckets: ${buckets.map(b => b.name).join(', ') || 'ninguno'}`
      )

      // Test 5: Verificar autenticación
      const { data: { session }, error: authError } = await supabase.auth.getSession()

      addResult(
        'Autenticación',
        authError ? 'error' : 'success',
        session ? `Usuario: ${session.user.email}` : 'No hay sesión activa (esto es normal si no estás logueado)'
      )

      // Test 6: API Key de OCR.space
      addResult(
        'API Key OCR.space',
        import.meta.env.VITE_OCR_API_KEY ? 'success' : 'error',
        import.meta.env.VITE_OCR_API_KEY 
          ? `Configurada (${import.meta.env.VITE_OCR_API_KEY.substring(0, 10)}...)` 
          : 'No configurada'
      )

    } catch (error) {
      addResult('Error General', 'error', error.message)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Diagnóstico de Conexión
          </h1>

          <button
            onClick={testConnection}
            disabled={testing}
            className="btn-primary mb-6"
          >
            {testing ? 'Probando...' : 'Probar Conexión'}
          </button>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  ) : (
                    <XCircle className="text-red-600 flex-shrink-0" size={24} />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {result.test}
                    </h3>
                    <p className="text-sm text-gray-700 break-all">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !testing && (
            <p className="text-gray-500 text-center py-8">
              Haz clic en "Probar Conexión" para verificar la configuración
            </p>
          )}

          {testing && (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestConnectionPage
