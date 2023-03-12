import React from 'react'
import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/SupabaseContext'

const About: React.FC = () => {
  const { client }: SupabaseContextProps = useSupabaseContext()

  React.useEffect(() => {}, [])

  return <div>Welcome to P10 Racing League!</div>
}

export default About
