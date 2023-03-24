import { Button, Typography } from '@mui/material'
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { Suspense, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import styles from './About.module.scss'

const About: React.FC = () => {
  const { user, client } = useSupabaseContext()
  const navigate = useNavigate()
  const gltf = useGLTF('/models/car.glb')

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
          <primitive object={gltf.scene} />
        </mesh>
      </group>
    )
  }

  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 500, position: [8, 1, 2] }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
      className={styles.canvas}
    >
      <Html className={styles.html} center>
        <div className={styles.heading}>
          <Typography variant="h1">P10 Racing</Typography>
          <Typography component="span" variant="h4">
            the ultimate F1 fantasy league!
          </Typography>
        </div>

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
      <OrbitControls />
    </Canvas>
  )
}

export default About
