declare module '#auth-utils' {
  interface User {
    id: string
    twitchId: number
    userName: string
  }

  interface UserSession {
    user: User
  }
}

export {}
