import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import React from 'react'
import { fetchPath } from './services/database'

const initFirebase = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBOQxaCS43e4hmLye-U8n5VRnjVP0sfgzs',
    authDomain: 'p10racing-5e630.firebaseapp.com',
    projectId: 'p10racing-5e630',
    storageBucket: 'p10racing-5e630.appspot.com',
    messagingSenderId: '626860315606',
    appId: '1:626860315606:web:9403ffcfe1f82d68f7ca77',
    measurementId: 'G-XL232WQS4L',
    databaseURL:
      'https://p10racing-5e630-default-rtdb.asia-southeast1.firebasedatabase.app/',
  }

  const app = initializeApp(firebaseConfig)
  getDatabase(app)
}

const App = () => {
  initFirebase()
  const fetchRoot = async () => {
    const val = await fetchPath('/')
    console.log(val)
  }
  return (
    <>
      <button onClick={() => fetchRoot()}>Fetch root</button>
      <h1>Hello world! I am using React</h1>
    </>
  )
}
export default App
