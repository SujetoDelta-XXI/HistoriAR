import { Map, Trophy, User, Settings } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'explore', label: 'Explorar', icon: Map },
    { id: 'tour', label: 'Mi Tour', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'config', label: 'Configuración', icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors ${
                isActive ? 'text-[#FF6600]' : 'text-black'
              }`}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${isActive ? 'text-[#FF6600]' : 'text-black'}`} 
                fill={isActive ? '#FF6600' : 'none'}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-[#FF6600]' : 'text-black'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}