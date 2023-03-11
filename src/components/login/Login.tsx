import {
  Auth,
  AuthProvider,
  browserSessionPersistence,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import Loader from '../loader/Loader'

const signIn = (
  auth: Auth,
  provider: AuthProvider,
  navigate: NavigateFunction
) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithPopup(auth, provider)
      })
    } else {
      navigate('/')
    }
  })
}

const Login: React.FC = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [loading] = useAuthState(auth)

  if (loading) return <Loader />

  return (
    <>
      <div>Login</div>
      <button onClick={() => signIn(auth, new GoogleAuthProvider(), navigate)}>
        Log in with Google
      </button>
      <button
        onClick={() => signIn(auth, new FacebookAuthProvider(), navigate)}
      >
        Log in with Facebook
      </button>
    </>
  )
}

export default Login
