import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Add any custom user properties here
}

export interface AuthSession extends Session {
  // Add any custom session properties here
}

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}