import { createClient, SupabaseClient } from '@supabase/supabase-js'
import React, { createContext, ReactNode } from 'react'

const SupabaseContext = createContext(null)

SupabaseContext.displayName = 'Supabase Context'

const useContext = () => {
  console.log('using context')
  const [user, setUser] = React.useState(null)
  const supabaseUrl = 'https://msrqldgafbaagfcxbcyv.supabase.co'
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnFsZGdhZmJhYWdmY3hiY3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1OTE1NjYsImV4cCI6MTk5NDE2NzU2Nn0.5zGGuJVpBoYLUCr53Haz671UMJw0AtFAHJo9giqnYYA'

  const client = createClient(supabaseUrl, supabaseKey)

  const checkUser = async (client: SupabaseClient) => {
    const {
      data: { user },
    } = await client.auth.getUser()
    if (user) {
      const { data } = await client.from('users').select('email')

      if (data.length === 0) {
        const { data } = await client
          .from('users')
          .insert([{ email: user.email, uuid: user.id }])
      }
    }
    setUser(user)
  }

  React.useEffect(() => {
    checkUser(client)
  }, [])
  return { client, user, setUser }
}

interface Props {
  children?: ReactNode
}

export interface SupabaseContextProps {
  client: SupabaseClient
}

export const useSupabaseContext = () => {
  const context = React.useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error(
      'Supabase Context undefined. Make sure you use the SupabaseProvider before using the context.'
    )
  }
  return context
}

export const SupabaseProvider = ({ children }: Props) => {
  const value = useContext()

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
