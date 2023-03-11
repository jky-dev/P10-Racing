import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from '../loader/Loader'

const signInWithGoogle = () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  onAuthStateChanged(auth, (user) => {
    if (!user)
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithPopup(auth, provider)
      })
  })
}

const Login: React.FC = () => {
  const auth = getAuth()
  const [user, loading, error] = useAuthState(auth)

  if (loading) return <Loader />

  return (
    <>
      <div>Login</div>
      <button onClick={signInWithGoogle}>click to log in with Google</button>
      {error && <div>{JSON.stringify(error)}</div>}
    </>
  )
}

export default Login
