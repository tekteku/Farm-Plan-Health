import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const FAKE_AUTH = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    FAKE_AUTH.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  },
  signout(callback: VoidFunction) {
    FAKE_AUTH.isAuthenticated = false
    setTimeout(callback, 100)
  },
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null)

  const signin = (newUser: string, callback: VoidFunction) => {
    return FAKE_AUTH.signin(() => {
      setUser(newUser)
      callback()
    })
  }

  const signout = (callback: VoidFunction) => {
    return FAKE_AUTH.signout(() => {
      setUser(null)
      callback()
    })
  }

  const value = { user, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthContext = React.createContext<{
  user: any,
  signin: (user: string, callback: VoidFunction) => void,
  signout: (callback: VoidFunction) => void,
}>(null!)

export function useAuth() {
  return React.useContext(AuthContext)
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth()
  if (!auth.user) {
    return <Navigate to="/login" />
  }

  return children
}
