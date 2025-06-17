'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, AuthState } from '@repo/database-types'
import { createClient } from '@/utils/supabase/client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    try {
      const supabase = createClient()
      
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
        })
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      setState(prev => ({ ...prev, loading: false }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}