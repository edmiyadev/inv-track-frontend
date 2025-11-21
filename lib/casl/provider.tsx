"use client"

import { createContext, useContext, ReactNode } from 'react'
import { createContextualCan } from '@casl/react'
import { useAuthStore } from '@/lib/store/auth'
import { createAbilityFromUser, defaultAbility, type AppAbility } from './ability'

// Contexto para la habilidad CASL
const AbilityContext = createContext<AppAbility>(defaultAbility)

// Hook para usar el contexto de habilidad
export const useAbility = () => useContext(AbilityContext)

// Componente Can tipado para React
export const Can = createContextualCan(AbilityContext.Consumer)

// Provider que proporciona las habilidades basadas en el usuario autenticado
interface AbilityProviderProps {
  children: ReactNode
}

export function AbilityProvider({ children }: AbilityProviderProps) {
  const user = useAuthStore((state) => state.user)
  
  // Crear habilidad basada en el usuario actual
  const ability = createAbilityFromUser(user)

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
