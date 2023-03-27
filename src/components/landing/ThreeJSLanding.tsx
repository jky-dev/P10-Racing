import { Button, Typography } from '@mui/material'
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import Loader from '../loader/Loader'
import { Car } from './Car/Car'
import styles from './ThreeJSLanding.module.scss'

const ThreeJSLanding = () => {
  const { user, client } = useSupabaseContext()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)

  const handleClick = () => {
    if (user) {
      navigate('/leagues')
    } else {
      client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
    }
  }

  const Model = () => {
    const ref = useRef()
    useFrame((state) => {
      const t = state.clock.getElapsedTime()
      //@ts-ignore
      ref.current.rotation.set(
        Math.cos(t / 4) / 8,
        Math.sin(t / 3) / 4,
        0.15 + Math.sin(t / 2) / 8
      )
      //@ts-ignore
      ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
    })
    return (
      <group ref={ref}>
        <mesh castShadow receiveShadow>
          <Car />
        </mesh>
      </group>
    )
  }
  return (
    <>
      <Canvas
        camera={{ fov: 40, near: 0.1, far: 500, position: [8, 1, 2] }}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        className={styles.canvas}
        onAnimationStart={() => setLoading(false)}
      >
        <Html className={styles.html} center>
          <div className={styles.heading}>
            <Typography variant={'h1'}>P10 Racing</Typography>
            <Typography component="span" variant="h4">
              The ultimate F1 fantasy league!
            </Typography>
          </div>
          <meta
            name="description"
            content="P10 Racing, the ultimate F1 fantasy league! Pick drivers before each race and compete against others in fun, competitive fantasy leagues."
          />

          <div className={styles.button}>
            <Button
              variant="outlined"
              onClick={handleClick}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              {user ? 'Join a league' : 'Get started'}
            </Button>
          </div>
        </Html>
        <pointLight position={[10, 10, 10]} castShadow />
        <Environment preset="sunset" background blur={100} />
        <Model />
        <ContactShadows
          resolution={512}
          position={[0, -1, 0]}
          opacity={1}
          scale={10}
          blur={2}
          far={5}
        />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      {loading && <Loader />}
    </>
  )
}

export default ThreeJSLanding
