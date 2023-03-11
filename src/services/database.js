import { child, get, ref, getDatabase } from 'firebase/database'

export const fetchPath = async (path) => {
  const dbRef = ref(getDatabase())

  const value = await get(child(dbRef, path))

  return value.val()
}
