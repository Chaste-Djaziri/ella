"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Cake, Gift, Music, ChevronRight, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [started, setStarted] = useState(false)
  const router = useRouter()
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (started) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [started])

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500 p-4 text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="mb-8"
          >
            <Sparkles className="h-16 w-16 mx-auto text-yellow-300" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-6 text-white">Hey Ella!</h1>
          <p className="text-xl mb-10 text-white/90">We made something special just for your birthday!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            Let's Celebrate! <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500 overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <header className="pt-10 pb-6 px-4 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="text-5xl font-bold text-white mb-2">Happy Birthday Ella!</h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center my-4"
          >
            <div className="h-1 w-24 bg-yellow-300 rounded-full"></div>
          </motion.div>
          <p className="text-xl text-white/90">Today is all about celebrating you!</p>
        </motion.div>
      </header>

      <main className="px-4 pb-20">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10 max-w-md mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg p-6 mb-8 border border-white/20 text-white">
            <div className="flex items-center mb-4">
              <Cake className="text-yellow-300 mr-3" size={28} />
              <h2 className="text-2xl font-bold">Birthday Wishes</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              Ella, on your special day, I want to wish you all the happiness in the world! You're an amazing friend who
              brings so much joy to my life.
            </p>
            <p className="leading-relaxed">
              May your day be filled with laughter, love, and unforgettable moments. Here's to celebrating you and all
              the wonderful things you are!
            </p>
          </div>

          <div className="grid gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/video")}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg h-auto"
              >
                <Music size={22} />
                Birthday Song Video
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/game")}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg h-auto"
              >
                <Gift size={22} />
                Birthday Quiz Challenge
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push("/wishes")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg h-auto"
              >
                <Heart size={22} />
                Birthday Wishes Database
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md py-4 px-4 text-center text-white border-t border-white/20">
        <p>Made with ❤️ just for you, Ella!</p>
      </footer>
    </div>
  )
}
