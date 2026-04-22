import { supabase } from '../../infrastructure/config/supabase'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export const salesRepository = {
  async create(saleData) {
    const { data, error } = await supabase
      .from('sales')
      .insert([saleData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTodaySales(storeId) {
    const today = new Date()
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', startOfDay(today).toISOString())
      .lte('created_at', endOfDay(today).toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getMonthSales(storeId) {
    const today = new Date()
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', startOfMonth(today).toISOString())
      .lte('created_at', endOfMonth(today).toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getSalesByDateRange(storeId, startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async uploadReceiptImage(file, userId, storeId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${storeId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  },
}
