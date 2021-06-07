export type Restaurant = {
  name: string
  url: string
  getMenu: () => Promise<string>
}
