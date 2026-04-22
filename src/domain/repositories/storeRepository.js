import { supabase } from '../../infrastructure/config/supabase'

export const storeRepository = {
  async create(storeData) {
    const { data, error } = await supabase
      .from('stores')
      .insert([storeData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}
