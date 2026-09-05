import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebase/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      },
      (error) => {
        // Missing/invalid Firebase config shouldn't hard-crash the app in dev.
        console.error('Auth listener error:', error)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    setAuthError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      setAuthError(error.code || error.message)
      return false
    }
  }

  const logout = () => firebaseSignOut(auth)

  const value = useMemo(
    () => ({ user, loading, authError, login, logout }),
    [user, loading, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- standard context+hook pairing
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
