"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Sparkles,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"

export default function VideoPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        togglePlay()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current

      const updateProgress = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100)
          setCurrentTime(video.currentTime)
        }
      }

      const handleDurationChange = () => {
        setDuration(video.duration)
      }

      video.addEventListener("timeupdate", updateProgress)
      video.addEventListener("durationchange", handleDurationChange)

      return () => {
        video.removeEventListener("timeupdate", updateProgress)
        video.removeEventListener("durationchange", handleDurationChange)
      }
    }
  }, [])

  useEffect(() => {
    const hideControlsTimer = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    hideControlsTimer()

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, showControls])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
      setShowControls(true)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && duration) {
      const newTime = (value[0] / 100) * duration
      videoRef.current.currentTime = newTime
      setProgress(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
    }
  }

  const handleVideoContainerInteraction = () => {
    setShowControls(true)
  }

  const handleVideoLoaded = () => {
    setIsLoading(false)
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
        <h1 className="text-3xl font-bold mb-2">Happy Birthday Ella!</h1>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-300" size={18} />
          <p className="text-white/80">A special birthday song just for you</p>
          <Sparkles className="text-yellow-300" size={18} />
        </div>
      </motion.div>

      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden shadow-xl bg-black mb-8 max-w-3xl mx-auto"
        onClick={handleVideoContainerInteraction}
        onMouseMove={handleVideoContainerInteraction}
        onTouchStart={handleVideoContainerInteraction}
      >
        {/* Video Player - Replace with your actual video */}
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full"
            poster="/placeholder.svg?height=400&width=600"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            onLoadedData={handleVideoLoaded}
          >
            {/* The user will add their video here */}
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-white mb-2" />
                <p className="text-white text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-20 h-20 flex items-center justify-center border border-white/40"
              >
                <Play className="w-10 h-10 fill-white ml-1" />
              </motion.button>
            </div>
          )}

          {/* Custom Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div className="mb-2">
              <Slider
                value={[progress]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&>span:first-child_span]:bg-pink-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  onClick={skipBackward}
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  size="sm"
                >
                  <SkipBack size={16} />
                </Button>
                <Button
                  onClick={togglePlay}
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  size="sm"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                <Button
                  onClick={skipForward}
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  size="sm"
                >
                  <SkipForward size={16} />
                </Button>
                <div className="text-xs ml-2">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  size="sm"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  size="sm"
                >
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Sparkles className="text-yellow-300" size={20} />
          Birthday Message
        </h2>
        <p className="mb-4 leading-relaxed">
          Ella, this song is a small token of how much you mean to me. Your friendship brings so much joy and laughter
          to my life.
        </p>
        <p className="leading-relaxed">
          I hope this birthday is just the beginning of an amazing year ahead filled with wonderful adventures and
          beautiful moments!
        </p>
      </div>
    </div>
  )
}
