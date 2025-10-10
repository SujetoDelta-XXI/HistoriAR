import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ArrowLeft, Trophy, X, CheckCircle, XCircle, Clock, Award } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface QuizScreenProps {
  monument: any
  onBack: () => void
  onQuizComplete: (score: number, totalQuestions: number) => void
}

export function QuizScreen({ monument, onBack, onQuizComplete }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])

  // Quiz questions based on monument type
  const getQuizQuestions = (monument: any): QuizQuestion[] => {
    const baseQuestions = [
      {
        id: 1,
        question: `¿En qué período histórico se construyó ${monument.name}?`,
        options: [monument.period, "Colonial", "Republicano", "Contemporáneo"],
        correctAnswer: 0,
        explanation: `${monument.name} fue construido durante el período ${monument.period}.`,
        points: 10
      },
      {
        id: 2,
        question: `¿Qué cultura o civilización creó ${monument.name}?`,
        options: [monument.culture, "Inca", "Chimú", "Wari"],
        correctAnswer: 0,
        explanation: `${monument.name} fue creado por la cultura ${monument.culture}.`,
        points: 10
      },
      {
        id: 3,
        question: "¿Cuál es la principal característica de la arquitectura precolombina?",
        options: [
          "Uso de piedras perfectamente talladas",
          "Construcción con ladrillos",
          "Uso de hierro y acero",
          "Techos de tejas"
        ],
        correctAnswer: 0,
        explanation: "La arquitectura precolombina se caracteriza por el uso de piedras perfectamente talladas sin mortero.",
        points: 15
      },
      {
        id: 4,
        question: "¿Qué función principal tenían los centros ceremoniales prehispánicos?",
        options: [
          "Comercio únicamente",
          "Rituales religiosos y ceremonias",
          "Vivienda común",
          "Almacenamiento de granos"
        ],
        correctAnswer: 1,
        explanation: "Los centros ceremoniales eran espacios sagrados dedicados a rituales religiosos y ceremonias importantes.",
        points: 15
      },
      {
        id: 5,
        question: "¿Por qué es importante preservar el patrimonio arqueológico?",
        options: [
          "Solo por valor económico",
          "Para entender nuestra historia y cultura",
          "Para atraer turistas únicamente",
          "No es importante"
        ],
        correctAnswer: 1,
        explanation: "Preservar el patrimonio arqueológico nos ayuda a entender nuestra historia, cultura e identidad como sociedad.",
        points: 20
      }
    ]

    return baseQuestions.sort(() => Math.random() - 0.5).slice(0, 3) // Random 3 questions
  }

  const [questions] = useState<QuizQuestion[]>(getQuizQuestions(monument))

  useEffect(() => {
    if (!showResult && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleTimeUp = () => {
    setUserAnswers([...userAnswers, -1]) // -1 indicates no answer (time up)
    setShowResult(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || quizCompleted) return
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const newUserAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newUserAnswers)

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + questions[currentQuestion].points)
    }

    setShowResult(true)

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(30)
      } else {
        setQuizCompleted(true)
        onQuizComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? questions[currentQuestion].points : 0), questions.length)
      }
    }, 2000)
  }

  const getScoreGrade = (finalScore: number, maxScore: number) => {
    const percentage = (finalScore / maxScore) * 100
    if (percentage >= 90) return { grade: "Excelente", color: "text-green-600", icon: Trophy }
    if (percentage >= 70) return { grade: "Muy Bien", color: "text-blue-600", icon: Award }
    if (percentage >= 50) return { grade: "Bien", color: "text-yellow-600", icon: CheckCircle }
    return { grade: "Necesita Mejorar", color: "text-red-600", icon: XCircle }
  }

  if (quizCompleted) {
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0)
    const finalScore = userAnswers.reduce((sum, answer, index) => {
      return sum + (answer === questions[index]?.correctAnswer ? questions[index].points : 0)
    }, 0)
    const { grade, color, icon: GradeIcon } = getScoreGrade(finalScore, maxScore)

    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="px-4 pt-12 pb-6 bg-white border-b border-gray-100">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-black">Quiz Completado</h1>
              <p className="text-gray-600">{monument.name}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-[#FF6600] rounded-full flex items-center justify-center mx-auto mb-4">
              <GradeIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${color}`}>{grade}</h2>
            <p className="text-gray-600 mb-4">Has completado el quiz sobre {monument.name}</p>
            <div className="text-3xl font-bold text-[#FF6600]">
              {finalScore} / {maxScore} puntos
            </div>
          </motion.div>

          {/* Question Review */}
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer
              const wasAnswered = userAnswer !== -1

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-black text-sm">{question.question}</h3>
                        <div className="flex items-center">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <Badge className="ml-2 bg-[#FF6600] text-white text-xs">
                            {isCorrect ? `+${question.points}` : '0'} pts
                          </Badge>
                        </div>
                      </div>
                      
                      {!wasAnswered && (
                        <Badge className="bg-yellow-500 text-white text-xs mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Tiempo agotado
                        </Badge>
                      )}

                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded-lg text-sm ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={onBack}
              className="bg-[#FF6600] hover:bg-[#E55A00] text-white px-8"
              style={{ backgroundColor: '#FF6600' }}
            >
              Continuar Explorando
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-black">Quiz - {monument.name}</h1>
            <p className="text-sm text-gray-600">Pregunta {currentQuestion + 1} de {questions.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#FF6600]" />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-[#FF6600]'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Puntuación: {score}</span>
            <span>{questions.reduce((sum, q) => sum + q.points, 0)} pts máximo</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">{currentQ.question}</h2>
                <Badge className="bg-[#FF6600] text-white">
                  {currentQ.points} pts
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'border-[#FF6600] bg-orange-50'
                      : showResult
                      ? index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : index === selectedAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : 'border-gray-200 hover:border-[#FF6600] hover:bg-orange-50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-black">{option}</p>
                      {showResult && (
                        <div>
                          {index === currentQ.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {index === selectedAnswer && index !== currentQ.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Explanation (shown after answering) */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-sm font-bold">i</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Explicación</h3>
                      <p className="text-blue-800 text-sm">{currentQ.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Button */}
          {!showResult && (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white disabled:bg-gray-300"
              style={selectedAnswer !== null ? { backgroundColor: '#FF6600' } : {}}
            >
              {currentQuestion + 1 === questions.length ? 'Finalizar Quiz' : 'Siguiente Pregunta'}
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}