import fetch from 'node-fetch'

export async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url)
  const body = await response.text()
  return body
}
