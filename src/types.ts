export type Command = {
  name: string | string[]
  execute: (message: any, params: string[]) => Promise<void>
}

export type Dictionary<T = any> = Record<string, T>
