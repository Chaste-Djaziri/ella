"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Cake, Trophy, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"
import { Card, CardContent } from "@/components/ui/card"

export default function GamePage() {
  const router = useRouter()
  const { width, height } = useWindowSize()
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [timerActive, setTimerActive] = useState(false)

  // Birthday quiz questions
  const questions = [
    {
      question: "What's the best birthday gift?",
      options: ["Money", "A surprise party", "A thoughtful handmade gift", "An expensive gadget"],
      correctAnswer: 2,
      explanation: "The thought and effort put into a handmade gift makes it special!",
    },
    {
      question: "What's the perfect birthday cake flavor?",
      options: ["Chocolate", "Vanilla", "Red Velvet", "Whatever Ella likes!"],
      correctAnswer: 3,
      explanation: "It's all about what the birthday person enjoys!",
    },
    {
      question: "How many candles should be on a birthday cake?",
      options: ["One for good luck", "One for each year", "As many as will fit", "One to grow on"],
      correctAnswer: 1,
      explanation: "Traditionally, one candle for each year of age!",
    },
    {
      question: "What's the best birthday activity?",
      options: ["Shopping spree", "Movie marathon", "Adventure outing", "Whatever makes Ella happy!"],
      correctAnswer: 3,
      explanation: "The birthday person's happiness is what matters most!",
    },
    {
      question: "What makes a birthday special?",
      options: ["Expensive gifts", "Lots of social media posts", "Time with loved ones", "A big party"],
      correctAnswer: 2,
      explanation: "Quality time with people who care about you is priceless!",
    },
  ]

  useEffect(() => {
    if (gameStarted && timerActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleAnswer(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, timerActive])

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setCurrentQuestion(0)
    setGameOver(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setTimeLeft(15)
    setTimerActive(true)
  }

  const handleAnswer = (answerIndex: number | null) => {
    setTimerActive(false)
    setSelectedAnswer(answerIndex)

    // Check if answer is correct
    const correct = answerIndex === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setTimeLeft(15)
        setTimerActive(true)
      } else {
        setGameOver(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500 p-4 relative text-white">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <Button onClick={() => router.push("/")} variant="ghost" className="mb-6 hover:bg-white/10 text-white">
        <ChevronLeft size={20} className="mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Birthday Quiz Challenge</h1>
        <p className="text-white/80">Test your birthday knowledge!</p>
      </motion.div>

      {!gameStarted && !gameOver ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-lg text-center border border-white/20 max-w-md mx-auto"
        >
          <Cake className="mx-auto text-yellow-300 mb-4" size={40} />
          <h2 className="text-xl font-bold mb-3">How to Play</h2>
          <p className="mb-6 text-white/90">
            Answer 5 fun birthday-themed questions! You have 15 seconds for each question. Let's see how well you know
            what makes birthdays special!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          >
            Start Quiz
          </motion.button>
        </motion.div>
      ) : gameOver ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-lg text-center border border-white/20 max-w-md mx-auto"
        >
          <Trophy className="mx-auto text-yellow-300 mb-4" size={40} />
          <h2 className="text-xl font-bold mb-3">Quiz Complete!</h2>
          <p className="mb-2">
            You scored {score} out of {questions.length}!
          </p>
          <p className="mb-6 text-white/90">
            {score === questions.length
              ? "Perfect score! You're a birthday expert!"
              : score >= 3
                ? "Great job! You know your birthday stuff!"
                : "Not bad! Birthdays are about fun anyway!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
              <Trophy size={18} className="text-yellow-300" />
              <span>
                {score}/{currentQuestion}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
              <Clock size={18} className="text-yellow-300" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg mb-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm mb-2">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <h3 className="text-xl font-bold">{questions[currentQuestion].question}</h3>
                  </div>

                  <div className="grid gap-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectedAnswer === null && handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-xl text-left transition-colors ${
                          selectedAnswer === null
                            ? "bg-white/20 hover:bg-white/30"
                            : selectedAnswer === index
                              ? isCorrect
                                ? "bg-green-500/70"
                                : "bg-red-500/70"
                              : index === questions[currentQuestion].correctAnswer && selectedAnswer !== null
                                ? "bg-green-500/70"
                                : "bg-white/10 opacity-70"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-lg bg-white/20"
                    >
                      <p>{questions[currentQuestion].explanation}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
