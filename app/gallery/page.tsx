"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ImageIcon, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function GalleryPage() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)

  // Placeholder for images - you'll replace these with actual images
  const placeholderImages = [
    {
      id: 1,
      src: "/placeholder.svg?height=400&width=300",
      alt: "Memory 1",
      caption: "That time we went hiking and couldn't stop laughing!",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=400&width=300",
      alt: "Memory 2",
      caption: "Remember this party? It was so much fun!",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=400&width=300",
      alt: "Memory 3",
      caption: "Our coffee date where we talked for hours!",
    },
  ]

  const nextImage = () => {
    setActiveIndex((prev) => (prev === placeholderImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? placeholderImages.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-4">
      <Button onClick={() => router.push("/")} variant="ghost" className="mb-6 hover:bg-pink-200">
        <ChevronLeft size={20} className="mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-2">Our Memories</h1>
        <p className="text-purple-700">Swipe through our special moments</p>
      </motion.div>

      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
          {placeholderImages.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} />
              <p className="mt-2">Photos will be added soon!</p>
            </div>
          ) : (
            <>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={placeholderImages[activeIndex].src || "/placeholder.svg"}
                  alt={placeholderImages[activeIndex].alt}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Navigation dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {placeholderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {placeholderImages.length > 0 && (
          <p className="text-center text-gray-700 italic">"{placeholderImages[activeIndex].caption}"</p>
        )}
      </div>

      {placeholderImages.length > 0 && (
        <div className="flex justify-between mb-8">
          <Button onClick={prevImage} variant="outline" className="bg-white/80 hover:bg-white">
            Previous
          </Button>
          <Button onClick={nextImage} variant="outline" className="bg-white/80 hover:bg-white">
            Next
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Heart className="text-pink-500 mr-3" size={24} fill="#EC4899" />
          <h2 className="text-xl font-bold text-pink-600">Birthday Message</h2>
        </div>
        <p className="text-gray-700 mb-4">
          These memories we've shared are just a small glimpse of the amazing friendship we have. You've been there for
          me through thick and thin, and I'm so grateful to have you in my life.
        </p>
        <p className="text-gray-700">
          I hope this birthday brings you as much joy as you bring to everyone around you. Here's to many more years of
          friendship and creating beautiful memories together!
        </p>
      </div>
    </div>
  )
}
