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
import Loader from '../loader/Loader'

const signIn = (auth: Auth, provider: AuthProvider) => {
  onAuthStateChanged(auth, (user) => {
    if (!user)
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithPopup(auth, provider)
      })
  })
}

const Login: React.FC = () => {
  const auth = getAuth()
  const [loading] = useAuthState(auth)

  if (loading) return <Loader />

  return (
    <>
      <div>Login</div>
      <button onClick={() => signIn(auth, new GoogleAuthProvider())}>
        Log in with Google
      </button>
      <button onClick={() => signIn(auth, new FacebookAuthProvider())}>
        Log in with Facebook
      </button>
    </>
  )
}

export default Login
