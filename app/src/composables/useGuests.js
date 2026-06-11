import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useGuests() {
  const guests = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 讀取所有賓客
  async function fetchGuests() {
    loading.value = true
    const { data, error: err } = await supabase
      .from('guests')
      .select('*')
      .order('id')

    if (err) error.value = err.message
    else guests.value = data
    loading.value = false
  }

  // 新增賓客
  async function addGuest(guest) {
    const { data, error: err } = await supabase
      .from('guests')
      .insert([{
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        meal_preference: guest.mealPreference,
        rsvp_status: guest.rsvpStatus,
        table_number: guest.table,
        notes: guest.notes
      }])
      .select()
      .single()

    if (err) error.value = err.message
    else guests.value.push(data)
  }

  // 更新賓客
  async function updateGuest(id, updates) {
    const { data, error: err } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) error.value = err.message
    else {
      const idx = guests.value.findIndex(g => g.id === id)
      if (idx !== -1) guests.value[idx] = data
    }
  }

  // 刪除賓客
  async function deleteGuest(id) {
    const { error: err } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)

    if (err) error.value = err.message
    else guests.value = guests.value.filter(g => g.id !== id)
  }

  return { guests, loading, error, fetchGuests, addGuest, updateGuest, deleteGuest }
}