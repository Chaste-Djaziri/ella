"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart, Star, MessageCircle, Send, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { addWish, getWishes, type Wish } from "../actions/wishes"
import { useToast } from "@/hooks/use-toast"

export default function WishesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAddWish, setShowAddWish] = useState(false)
  const [newWish, setNewWish] = useState("")
  const [newWishName, setNewWishName] = useState("")
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const wishInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    async function loadWishes() {
      try {
        setLoading(true)
        const fetchedWishes = await getWishes()
        setWishes(fetchedWishes)
      } catch (error) {
        console.error("Failed to load wishes:", error)
        toast({
          title: "Error",
          description: "Failed to load birthday wishes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadWishes()
  }, [toast])

  const nextWish = () => {
    if (wishes.length > 0) {
      setActiveIndex((prev) => (prev === wishes.length - 1 ? 0 : prev + 1))
    }
  }

  const prevWish = () => {
    if (wishes.length > 0) {
      setActiveIndex((prev) => (prev === 0 ? wishes.length - 1 : prev - 1))
    }
  }

  const handleAddWish = async () => {
    if (newWish.trim() && newWishName.trim()) {
      try {
        setSubmitting(true)
        const result = await addWish(newWishName, newWish)

        if (result.success) {
          toast({
            title: "Success!",
            description: "Your birthday wish for Ella has been added!",
          })

          // Refresh wishes
          const updatedWishes = await getWishes()
          setWishes(updatedWishes)

          // Reset form
          setNewWish("")
          setNewWishName("")
          setShowAddWish(false)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add your wish. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error adding wish:", error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500 p-4 text-white">
      <Button onClick={() => router.push("/")} variant="ghost" className="mb-6 hover:bg-white/10 text-white">
        <ChevronLeft size={20} className="mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Birthday Wishes for Ella</h1>
        <p className="text-white/80">Swipe through special messages</p>
      </motion.div>

      <div className="max-w-md mx-auto mb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
            <p>Loading birthday wishes...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <Star className="mx-auto text-yellow-300 mb-4" size={32} />
            <h3 className="text-xl font-medium mb-2">No Wishes Yet</h3>
            <p className="mb-4">Be the first to leave a birthday wish for Ella!</p>
            <Button
              onClick={() => setShowAddWish(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              Add a Wish
            </Button>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <Card
                  className={`bg-gradient-to-br ${wishes[activeIndex].color} border-none shadow-lg overflow-hidden`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-end mb-2">
                      <Star className="text-yellow-200 fill-yellow-200" size={20} />
                    </div>
                    <p className="text-lg mb-6 leading-relaxed">{wishes[activeIndex].message}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                          <Heart size={16} className="text-white" />
                        </div>
                        <span className="font-medium">From: {wishes[activeIndex].name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mb-8">
              <Button onClick={prevWish} variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                Previous
              </Button>
              <div className="flex gap-1 items-center">
                {wishes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
              <Button onClick={nextWish} variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                Next
              </Button>
            </div>
          </>
        )}

        {!showAddWish ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddWish(true)}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-3 rounded-xl border border-white/20 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Add Your Birthday Wish
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
          >
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-300" />
              Add Your Wish for Ella
            </h3>
            <div className="mb-3">
              <input
                type="text"
                value={newWishName}
                onChange={(e) => setNewWishName(e.target.value)}
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                disabled={submitting}
              />
              <textarea
                ref={wishInputRef}
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                placeholder="Write your birthday wish here..."
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[100px]"
                disabled={submitting}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddWish(false)}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddWish}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex items-center gap-2"
                disabled={!newWish.trim() || !newWishName.trim() || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Wish
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <Heart className="text-pink-300 mr-3" size={24} fill="#F9A8D4" />
          <h2 className="text-xl font-bold">A Note for Ella</h2>
        </div>
        <p className="mb-4 leading-relaxed">
          Ella, these wishes from your friends and loved ones show how special you are to everyone. Your friendship is a
          gift that keeps on giving.
        </p>
        <p className="leading-relaxed">
          I hope this birthday brings you as much joy as you bring to everyone around you. Here's to celebrating you
          today and always!
        </p>
      </div>
    </div>
  )
}
