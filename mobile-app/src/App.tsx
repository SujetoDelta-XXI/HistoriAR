import { useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { LoginScreen } from './components/LoginScreen'
import { MapExploreScreen } from './components/MapExploreScreen'
import { MyTourScreen } from './components/MyTourScreen'
import { ARViewerScreen } from './components/ARViewerScreen'
import { QuizScreen } from './components/QuizScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { ConfigurationScreen } from './components/ConfigurationScreen'
import { BottomNavigation } from './components/BottomNavigation'

type Screen = 'splash' | 'login' | 'explore' | 'tour' | 'ar' | 'quiz' | 'profile' | 'config'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash')
  const [activeTab, setActiveTab] = useState('explore')
  const [selectedMonument, setSelectedMonument] = useState(null)
  const [visitedMonuments, setVisitedMonuments] = useState<Set<number>>(new Set([1, 2, 5, 6])) // IDs de monumentos visitados
  const [isFromTour, setIsFromTour] = useState(false)
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])

  const handleNavigate = (screen: Screen, data?: any) => {
    setNavigationHistory(prev => [...prev, currentScreen])
    setCurrentScreen(screen)
    if (data) {
      setSelectedMonument(data)
    }
    
    // Update active tab for main screens
    if (['explore', 'tour', 'profile', 'config'].includes(screen)) {
      setActiveTab(screen)
    }
  }

  const handleMonumentSelect = (monument: any) => {
    setSelectedMonument(monument)
    setIsFromTour(currentScreen === 'tour')
    setCurrentScreen('ar')
  }

  const handleQuizStart = (monument: any) => {
    setSelectedMonument(monument)
    setCurrentScreen('quiz')
  }

  const handleMarkAsVisited = (monumentId: number) => {
    setVisitedMonuments(prev => new Set([...prev, monumentId]))
  }

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    // Here you could save the quiz score to the monument data
    console.log(`Quiz completed with score: ${score}/${totalQuestions}`)
  }

  const handleBack = () => {
    const previousScreen = navigationHistory[navigationHistory.length - 1]
    if (previousScreen) {
      setNavigationHistory(prev => prev.slice(0, -1))
      setCurrentScreen(previousScreen as Screen)
    } else {
      setCurrentScreen('explore')
    }
    setIsFromTour(false)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentScreen(tab as Screen)
    setNavigationHistory([])
    setIsFromTour(false)
  }

  const showBottomNav = ['explore', 'tour', 'profile', 'config'].includes(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('login')} />
      
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('explore')} />
      
      case 'explore':
        return (
          <MapExploreScreen 
            onMonumentSelect={handleMonumentSelect}
            visitedMonuments={visitedMonuments}
          />
        )
      
      case 'tour':
        return (
          <MyTourScreen 
            visitedMonuments={visitedMonuments}
            onMonumentSelect={handleMonumentSelect}
            onQuizStart={handleQuizStart}
          />
        )
      
      case 'ar':
        return (
          <ARViewerScreen 
            monument={selectedMonument} 
            onBack={handleBack}
            onMarkAsVisited={handleMarkAsVisited}
            isFromTour={isFromTour}
          />
        )
      
      case 'quiz':
        return (
          <QuizScreen 
            monument={selectedMonument}
            onBack={handleBack}
            onQuizComplete={handleQuizComplete}
          />
        )
      
      case 'profile':
        return <ProfileScreen />
      
      case 'config':
        return <ConfigurationScreen />
      
      default:
        return (
          <MapExploreScreen 
            onMonumentSelect={handleMonumentSelect}
            visitedMonuments={visitedMonuments}
          />
        )
    }
  }

  return (
    <div className="h-screen bg-white overflow-hidden relative">
      {renderScreen()}
      
      {showBottomNav && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}
    </div>
  )
}