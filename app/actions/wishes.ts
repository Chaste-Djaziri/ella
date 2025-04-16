"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type Wish = {
  id: string
  name: string
  message: string
  color: string
  created_at: string
}

export async function getWishes(): Promise<Wish[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("wishes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishes:", error)
      return []
    }

    return data as Wish[]
  } catch (error) {
    console.error("Failed to fetch wishes:", error)
    return []
  }
}

export async function addWish(name: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!name.trim() || !message.trim()) {
      return { success: false, error: "Name and message are required" }
    }

    const supabase = createServerSupabaseClient()

    // Generate a random color from our predefined list
    const colors = [
      "from-pink-500 to-rose-500",
      "from-yellow-400 to-amber-500",
      "from-cyan-500 to-blue-500",
      "from-green-400 to-emerald-500",
      "from-purple-500 to-indigo-500",
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const { error } = await supabase.from("wishes").insert([{ name, message, color: randomColor }])

    if (error) {
      console.error("Error adding wish:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the wishes page to show the new wish
    revalidatePath("/wishes")

    return { success: true }
  } catch (error) {
    console.error("Failed to add wish:", error)
    return { success: false, error: "Failed to add wish. Please try again." }
  }
}
