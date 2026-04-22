const OCR_API_KEY = import.meta.env.VITE_OCR_API_KEY

export const aiService = {
  async extractReceiptData(imageBase64) {
    if (!OCR_API_KEY) {
      throw new Error('API key de OCR.space no configurada')
    }

    console.log('Iniciando extracción de datos con OCR.space...')
    
    try {
      // Paso 1: Extraer texto con OCR.space
      const formData = new FormData()
      formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`)
      formData.append('language', 'spa')
      formData.append('isOverlayRequired', 'false')
      formData.append('detectOrientation', 'true')
      formData.append('scale', 'true')
      formData.append('OCREngine', '2')

      const ocrResponse = await fetch(
        'https://api.ocr.space/parse/image',
        {
          method: 'POST',
          headers: {
            'apikey': OCR_API_KEY,
          },
          body: formData,
        }
      )

      if (!ocrResponse.ok) {
        throw new Error(`Error OCR: ${ocrResponse.statusText}`)
      }

      const ocrData = await ocrResponse.json()
      
      if (ocrData.IsErroredOnProcessing) {
        throw new Error(`Error procesando imagen: ${ocrData.ErrorMessage?.[0] || 'Error desconocido'}`)
      }

      const extractedText = ocrData.ParsedResults?.[0]?.ParsedText || ''
      console.log('Texto extraído:', extractedText)

      // Paso 2: Analizar el texto extraído
      const parsedData = this.parseReceiptText(extractedText)

      return {
        amount: parsedData.monto || 0,
        paymentMethod: parsedData.metodo_pago || 'efectivo',
        items: parsedData.items || [],
        date: parsedData.fecha || new Date().toISOString(),
        confidence: parsedData.confidence || 0.5,
        rawData: parsedData,
      }
    } catch (error) {
      console.error('Error extracting receipt data:', error)
      throw error
    }
  },

  parseReceiptText(text) {
    // Extraer monto (busca números con formato chileno: 1.000, 10.000, etc)
    const amountPatterns = [
      /\$\s*([0-9]{1,3}(?:\.[0-9]{3})*)/,  // $1.000 o $10.000
      /total[:\s]+\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*)/i,
      /monto[:\s]+\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*)/i,
      /([0-9]{1,3}(?:\.[0-9]{3})+)/,  // cualquier número con puntos
    ]

    let monto = null
    for (const pattern of amountPatterns) {
      const match = text.match(pattern)
      if (match) {
        monto = parseFloat(match[1].replace(/\./g, ''))
        break
      }
    }

    // Detectar método de pago
    let metodo_pago = 'efectivo'
    const textLower = text.toLowerCase()
    
    if (textLower.includes('transferencia') || textLower.includes('transfer')) {
      metodo_pago = 'transferencia'
    } else if (textLower.includes('débito') || textLower.includes('debito')) {
      metodo_pago = 'tarjeta_debito'
    } else if (textLower.includes('crédito') || textLower.includes('credito') || textLower.includes('tarjeta')) {
      metodo_pago = 'tarjeta_credito'
    }

    // Extraer fecha si está presente
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // DD/MM/YYYY o DD-MM-YYYY
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD
    ]

    let fecha = null
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        try {
          const [_, p1, p2, p3] = match
          // Intentar construir fecha válida
          const year = p3.length === 4 ? p3 : (p1.length === 4 ? p1 : `20${p3}`)
          const month = p2.length === 4 ? p1 : p2
          const day = p1.length === 4 ? p2 : p1
          fecha = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).toISOString()
        } catch (e) {
          fecha = null
        }
        if (fecha) break
      }
    }

    // Confianza basada en si se encontró un monto
    const confidence = monto ? 0.8 : 0.3

    return {
      monto,
      metodo_pago,
      items: [],
      fecha,
      confidence,
    }
  },

  async analyzeSalesTrends(salesData) {
    try {
      const salesSummary = salesData.map(sale => ({
        amount: sale.amount,
        payment_method: sale.payment_method,
        date: sale.created_at,
      }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analiza estos datos de ventas y proporciona insights breves en español: ${JSON.stringify(salesSummary)}. 
                    Responde en 2-3 oraciones con recomendaciones prácticas.`,
                  },
                ],
              },
            ],
          }),
        }
      )

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error analyzing trends:', error)
      return 'No hay suficientes datos para análisis'
    }
  },
}
