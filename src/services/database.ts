import { User } from 'firebase/auth'
import { child, get, getDatabase, ref, set } from 'firebase/database'

export const fetchPath = async (path: string) => {
  const dbRef = ref(getDatabase())

  const value = await get(child(dbRef, path))

  return value.val()
}

export const dbCreateLeague = () => {
  const shortUuid = crypto.randomUUID().slice(0, 7)
  console.log(shortUuid)
}

export const dbInitUser = (user: User) => {
  const dbRef = ref(getDatabase())

  get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
    if (!snapshot.exists()) {
      setUpNewUser(user)
    }
  })
}

const setUpNewUser = (user: User) => {
  set(ref(getDatabase(), 'users/' + user.uid), {
    username: user.displayName,
    email: user.email,
    leagues: [],
  })
}
