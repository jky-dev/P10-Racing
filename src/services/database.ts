import { useSupabaseContext } from '../contexts/SupabaseContext'

export const test = async () => {
  const { client } = useSupabaseContext()
  const { data, error } = await client.from('constructor').select('*')
  console.log(data)
}
