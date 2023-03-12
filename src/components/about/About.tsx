import { SupabaseClient } from '@supabase/supabase-js'
import React from 'react'
import {
  SupabaseContextProps,
  useSupabaseContext,
} from '../../contexts/Context'

const fetchDataTest = async (client: SupabaseClient) => {
  let { data: constructor, error } = await client
    .from('constructor')
    .select('*')

  console.log(constructor)
}

const About: React.FC = () => {
  const { client }: SupabaseContextProps = useSupabaseContext()

  React.useEffect(() => {
    fetchDataTest(client)
  }, [])

  return <div>Welcome to P10 Racing League!</div>
}

export default About
