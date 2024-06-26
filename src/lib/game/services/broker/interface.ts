export interface Registry {
  unregister: () => void
}

export interface Callable {
  [key: string]: Function
}

export interface Subscriber {
  [key: string]: Callable
}

export interface Broker {
  dispatch: <T>(event: string, arg?: T) => void
  register: (event: string, callback: Function) => Registry
}
