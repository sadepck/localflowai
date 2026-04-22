import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

interface ReceiptData {
  monto: number | null
  metodo_pago: string | null
  items: string[]
  fecha: string | null
  confidence: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

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
                  text: `Analiza esta imagen de un comprobante de venta o transferencia bancaria chilena. 
                  Extrae la siguiente información y responde SOLO con un objeto JSON válido (sin markdown):
                  {
                    "monto": número (solo el valor numérico, sin símbolos),
                    "metodo_pago": string ("efectivo", "transferencia", "tarjeta_debito", "tarjeta_credito"),
                    "items": array de strings con los productos/servicios si están visibles,
                    "fecha": string en formato ISO si está visible,
                    "confidence": number entre 0 y 1
                  }
                  Si no puedes extraer algún dato, usa null.`,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const parsedData: ReceiptData = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          amount: parsedData.monto || 0,
          paymentMethod: parsedData.metodo_pago || 'efectivo',
          items: parsedData.items || [],
          date: parsedData.fecha || new Date().toISOString(),
          confidence: parsedData.confidence || 0.5,
          rawData: parsedData,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
