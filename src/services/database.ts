import { User } from 'firebase/auth'
import { child, get, getDatabase, push, ref, set } from 'firebase/database'

export const fetchPath = async (path: string) => {
  const dbRef = ref(getDatabase())

  const value = await get(child(dbRef, path))

  return value.val()
}

export const dbCreateLeague = async (user: User, name: string) => {
  // create a new league
  const leagueKey = push(ref(getDatabase(), 'leagues'), {
    name: name,
  }).key

  // add league to user
  push(ref(getDatabase(), `users/${user.uid}/leagues`), {
    league: leagueKey,
    name: name,
  })

  // add user to league
  push(ref(getDatabase(), `leagues/${leagueKey}/members`), {
    id: user.uid,
    name: user.displayName,
  })
}

export const dbInitUser = async (user: User) => {
  const dbUser = await fetchPath(`users/${user.uid}`)

  if (dbUser === null) {
    setUpNewUser(user)
  }
}

const setUpNewUser = (user: User) => {
  set(ref(getDatabase(), 'users/' + user.uid), {
    username: user.displayName,
    email: user.email,
    leagues: [],
  })
}
