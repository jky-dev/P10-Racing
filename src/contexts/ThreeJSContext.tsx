import { ContactShadows, Environment } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

interface ThreeJSContextProps {
  renderModel: () => JSX.Element
}

const ThreeJSContext = createContext<ThreeJSContextProps | null>(null)

ThreeJSContext.displayName = 'Utils Context'

const renderModel = () => {
  const gltf = useLoader(GLTFLoader, './redbull_formula_1_2022_car.glb')
  const [loading, setLoading] = useState(true)

  const memo = React.useMemo(() => {
    const Loader = () => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <h2>Loading...</h2>
        </div>
      )
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
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: '-1',
        }}
      >
        {loading ? (
          <Loader></Loader>
        ) : (
          <Canvas
            camera={{ fov: 45, near: 0.1, far: 500, position: [5, 1, 2] }}
          >
            <pointLight position={[10, 10, 10]} castShadow />
            <Environment preset="city" background blur={1} />
            <Model />
            <ContactShadows
              resolution={512}
              position={[0, -0.8, 0]}
              opacity={1}
              scale={10}
              blur={2}
              far={0.8}
            />
          </Canvas>
        )}
      </div>
    )
  }, [gltf, loading])

  useEffect(() => {
    setLoading(false)
  }, [])

  return memo
}

const useContext = () => {
  return { renderModel }
}

export const useThreeJSContext: () => ThreeJSContextProps = () => {
  const context = React.useContext(ThreeJSContext)

  if (!context) {
    throw new Error('ThreeJSContext undefined')
  }

  return context
}

interface Props {
  children?: ReactNode
}

export const ThreeJSProvider = ({ children }: Props) => {
  const value = useContext()

  return (
    <ThreeJSContext.Provider value={value}>{children}</ThreeJSContext.Provider>
  )
}
