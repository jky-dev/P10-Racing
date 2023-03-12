import { SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseContext } from '../contexts/SupabaseContext'
import { LeaguesProps } from '../interfaces'

export const test = async () => {
  const { client } = useSupabaseContext()
  const { data, error } = await client.from('constructor').select('*')
  console.log(data)
}

export const createLeague = async (
  client: SupabaseClient,
  user: any,
  name: string,
  code: string
) => {
  const { data: league_data } = await client
    .from('leagues')
    .insert([
      {
        name: name,
        invite_code: code,
        created_by_uuid: user.id,
      },
    ])
    .select()

  const returnedRecord = league_data[0] as LeaguesProps

  const { data } = await client
    .from('league_members')
    .insert([{ league_id: returnedRecord.id, user_uuid: user.id }])
}
