import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const guests = ref([]);
const loading = ref(false);
const error = ref(null);

export function useGuests() {
  // 讀取所有賓客
  async function fetchGuests() {
    loading.value = true;
    const { data: guestsData, error: err } = await supabase
      .from("guests")
      .select("*")
      .order("id");
    if (err) {
      error.value = err.message;
    } else {
      guests.value = guestsData;
    }
    loading.value = false;
  }

  // 讀取單一賓客（依 id）
  async function fetchGuestById(id) {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .single();

    loading.value = false;

    if (err) {
      error.value = err.message;
      return null;
    }
    return data;
  }

  // 新增賓客
  async function addGuest(guest) {
    const { data, error: err } = await supabase
      .from("guests")
      .insert([
        {
          name: guest.name,
          email: guest.email,
          phone_last_3_code: guest.phoneLast3Code,
          meal_preference: guest.mealPreference,
          rsvp_status: guest.rsvpStatus,
          table_number: guest.tableNumber,
          table_name: guest.tableName,
          notes: guest.notes,
        },
      ])
      .select()
      .single();

    if (err) {
        error.value = err.message;
        return { success: false, error: err.message };
    } else {
        guests.value.push(data);
        return { success: true, data };
    }
  }

  // 更新賓客
  async function updateGuest(id, updates) {
    const { data, error: err } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } else {
      const idx = guests.value.findIndex((g) => g.id === id);
      if (idx !== -1) {
        guests.value[idx] = data;
      }
      return { success: true, data };
    }
  }

  // 刪除賓客
  async function deleteGuest(id) {
    const { error: err } = await supabase
      .from("guests")
      .delete()
      .eq("id", id);

    if (err) {
      error.value = err.message;
    } else {
      guests.value = guests.value.filter((g) => g.id !== id);
    }
  }

  return {
    guests,
    loading,
    error,
    fetchGuests,
    fetchGuestById,
    addGuest,
    updateGuest,
    deleteGuest,
  };
}